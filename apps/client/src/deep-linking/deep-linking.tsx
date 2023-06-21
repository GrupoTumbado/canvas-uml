import React from "react";
import ReactDOM from "react-dom/client";
import DeepLinkingApp from "./deep-linking-app";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <DeepLinkingApp />
    </React.StrictMode>,
);
