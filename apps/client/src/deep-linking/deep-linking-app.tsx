import { useState } from "react";
import reactLogo from "../assets/react.svg";
import "./deep-linking-app.css";

function DeepLinkingApp() {
    const [count, setCount] = useState(0);
    const searchParams = new URLSearchParams(document.location.search);

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
            <p>Params: {searchParams.get("ltik")}</p>
        </>
    );
}

export default DeepLinkingApp;
