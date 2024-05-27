import { Input } from "@/components/ui/input";
import { SendButton }  from "@/components/ui/sendButton";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useParams } from 'react-router-dom';

import {
  useChatInteract,
  useChatMessages,
  sessionState,
  IStep,
  useChatSession,
  ChainlitAPI
} from "@chainlit/react-client";
import { useState } from "react";
import { CgArrowLeft } from "react-icons/cg";
import AppBar from "../components/ui/AppBar";
const CHAINLIT_SERVER = "http://localhost:8000";
const userEnv = {};

const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "app");
interface Podcast {
  _id: string,
  author: string,
  title: string,
  description: string,
  image: string,
  mp3: string,
  duration: number,
  __version: number,
  transcript: number,
  aws_id: string,
}
function Playground() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChatInteract();
  const { messages } = useChatMessages();
  const { disconnect, connect } = useChatSession()
  const session = useRecoilValue(sessionState)

  const { aws_id } = useParams()
  useEffect(() => {
    console.log("component mounted")
    console.log("connecting..")
    const token = localStorage.getItem("chainlitToken")
    connect({
      client: apiClient,
      userEnv: { aws_id },
      accessToken: `Bearer: ${token}`,
    });
    if (session?.socket.connected) {
      connect.log("connected")
    }
  }, [connect]);


  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (content) {
      const message: IStep = {
        id: uuidv4(),
        name: "user",
        type: "user_message",
        output: content,
        createdAt: new Date().toISOString(),
      };
      sendMessage(message, []);
      setInputValue("");
    }
  };

  const renderMessage = (message: IStep) => {
    const dateOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(message.createdAt).toLocaleTimeString(
      undefined,
      dateOptions
    );
    return (
      <div key={message.id} className="flex items-start space-x-2">
        <div className="w-20 text-sm text-green-500">{message.name}</div>
        <div className="flex-1 border rounded-lg p-2">
          <p className="text-black dark:text-white">{message.output}</p>
          <small className="text-xs text-gray-500">{date}</small>
        </div>
      </div>
    );
  };

  return (
    
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      
      <div className="border-b p-4 bg-white dark:bg-gray-800 flex items-center">
        <CgArrowLeft className="cursor-pointer" onClick={() => {
          console.log("disconnecting")
          disconnect()
          console.log("disconnected")
          window.location.href = "/";
        }} />
      
        <AppBar name={ localStorage.getItem("username")}/>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {messages.map((message) => renderMessage(message))}
        </div>
      </div>
      <div className="border-t p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <Input
            autoFocus
            className="flex-1"
            id="message-input"
            placeholder="Lets chat! with podcaster.."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <SendButton onClick={handleSendMessage} type="submit">
            Send
          </SendButton>
        </div>
      </div>
    </div>
  );
}
export default Playground