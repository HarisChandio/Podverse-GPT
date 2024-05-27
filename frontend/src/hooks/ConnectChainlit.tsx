
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { ChainlitAPI, sessionState, useChatSession } from "@chainlit/react-client";
export function connectChainlitServer() {
    const session = useRecoilValue(sessionState);
    const CHAINLIT_SERVER = "http://localhost:8000";
    const apiClient = new ChainlitAPI(CHAINLIT_SERVER, "app");

    try {
        useEffect(() => {
            if (session?.socket.connected) {
                console.log("Already connected");
                return;
            }
            fetch(apiClient.buildEndpoint("/custom-auth"))
                .then((res) => {
                    return res.json();
                }).then((data) => {
                    console.log("Custom auth data", data);
                    localStorage.setItem("chainlitToken", data.token);
                })
        });
        console.log("Connected to Chainlit Server")
    } catch (error) {
        console.log("Error while connecting to Chainlit Server", error)
    }
}
