import os
import aiohttp
from typing import List
import chainlit as cl
from openai import AsyncOpenAI
from fastapi.responses import JSONResponse
from chainlit.auth import create_jwt
from chainlit.server import app
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts.chat import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_community.chat_models import ChatOpenAI
from langchain.docstore.document import Document
from langchain.memory import ChatMessageHistory, ConversationBufferMemory

from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# Initialize the OpenAI and embeddings client
client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
embeddings = OpenAIEmbeddings(api_key=os.environ["OPENAI_API_KEY"])

# Chat settings
settings = {
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "max_tokens": 500,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0,
}

# Text splitter configuration
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)

system_template = """
Use the following pieces of context to answer the question of the user and engage in a deep, casual conversation about a podcast.

If you don't know the answer, just say that you don't know, don't try to make up an answer.
ALWAYS return a "SOURCES" part in your answer.
The "SOURCES" part should be a reference to the source of the document from which you got your answer.
Example of your response should be:


The answer is foo
SOURCES: xyz


Begin!

----------------
{summaries}
"""
messages = [
    SystemMessagePromptTemplate.from_template(system_template),
    HumanMessagePromptTemplate.from_template("{question}"),
]
prompt = ChatPromptTemplate.from_messages(messages)
chain_type_kwargs = {"prompt": prompt}


async def fetch_transcript(url: str) -> str:
    """ Fetch transcript text from the given URL. """
    print("Fetching Transcript Data from AWS S3...")
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()


async def prepare_transcript_data(aws_id: str):
    print("preparing transcript data...")
    """ Prepare transcript data by fetching, splitting, and indexing it. """
    transcript_url = f"https://myawschatpod.s3.eu-north-1.amazonaws.com/lex-trans-400-414/{aws_id}.txt"
    transcript_text = await fetch_transcript(transcript_url)
    texts = text_splitter.split_text(transcript_text)
    metadatas = [{"source": f"chunk-{i}"} for i in range(len(texts))]
    # Synchronously creating Chroma vector store as the function might not be asynchronous
    return Chroma.from_texts(texts, embeddings, metadatas=metadatas)


@app.get("/custom-auth")
async def custom_auth():
    """ Endpoint for custom authentication, returning a JWT. """
    token = create_jwt(cl.User(identifier="Test User"))
    return JSONResponse({"token": token})

import json
@cl.on_chat_start
async def on_chat_start():
    print("Chat started...")
    user_env = cl.user_session.get("env")
    if user_env:    
        if isinstance(user_env, str):
        # Parse user_env from string to dict if necessary
            user_env = json.loads(user_env)

        aws_id = user_env.get('aws_id', 'default-aws-id')
        print("AWS Transcript ID:", aws_id)

        msg = cl.Message(content=f"Processing podcast, kindly wait a few seconds..", disable_feedback=False)
        await msg.send()

        docsearch = await prepare_transcript_data(aws_id)
        cl.user_session.set("docsearch", docsearch)

        message_history = ChatMessageHistory()

        memory = ConversationBufferMemory(
            memory_key="chat_history",
            output_key="answer",
            chat_memory=message_history,
            return_messages=True,
        )

        chain = ConversationalRetrievalChain.from_llm(
            ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0, streaming=True),
            chain_type="stuff",
            retriever=docsearch.as_retriever(),
            memory=memory,
            return_source_documents=True,
        )
        # Let the user know that the system is ready
        msg.content = f"Processing done. You can now ask questions!"
        print("Training completed.")
        await msg.update()

        cl.user_session.set("chain", chain)
    else:
        print("user_env is not provided or is None")


@cl.on_message
async def on_message(message: cl.Message):
    """ Handle incoming messages and respond using the indexed data. """
    chain = cl.user_session.get("chain")  # Retrieve the indexed Chroma vector store from the session
    cb = cl.AsyncLangchainCallbackHandler()

    res = await chain.acall(message.content, callbacks=[cb])
    answer = res["answer"]
    source_documents = res["source_documents"]  # type: List[Document]

    text_elements = []  # type: List[cl.Text]

    if source_documents:
        for source_idx, source_doc in enumerate(source_documents):
            source_name = f"source_{source_idx}"
            # Create the text element referenced in the message
            text_elements.append(
                cl.Text(content=source_doc.page_content, name=source_name)
            )
        source_names = [text_el.name for text_el in text_elements]

        # if source_names:
        #     answer += f"\nSources: {', '.join(source_names)}"
        # else:
        #     answer += "\nNo sources found"

    await cl.Message(content=answer, elements=text_elements).send()

@cl.on_chat_end
async def end_session():
    print("ending session...")
    cl.user_session.set("docsearch", None)
    cl.user_session.set("chain", None)
    cl.user_session.set("env", None)
    print("Session ended.")
