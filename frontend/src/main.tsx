import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import "./index.css";
import { AudioProvider } from "./hooks/AudioContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(

  <RecoilRoot>
    <AudioProvider>
      <App />
    </AudioProvider>
  </RecoilRoot>

);
