import React from "react";
import ReactDOM from "react-dom/client";
import LaunchApp from "./launch-app";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <LaunchApp />
    </React.StrictMode>,
);
