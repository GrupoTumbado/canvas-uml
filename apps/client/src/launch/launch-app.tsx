import { useEffect, useState } from "react";
import "./launch-app.css";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";

function LaunchApp() {
    const [isLoading, setIsLoading] = useState(true);
    const [apiResponseCode, setApiResponseCode] = useState(0);
    const [repoUrl, setRepoUrl] = useState("");
    const [message, setMessage] = useState("");

    const searchParams: URLSearchParams = new URLSearchParams(document.location.search);

    useEffect(() => {
        try {
            fetch("/api/lti/launch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ltik: searchParams.get("ltik"),
                }),
            }).then((res) => {
                setApiResponseCode(res.status);
                setIsLoading(false);
            });
        } catch (err) {
            console.log(err);
            setApiResponseCode(500);
            setIsLoading(false);
        }
    }, []);

    const renderUnauthorized = (
        <>
            <h1>No estás autorizado para acceder a este recurso</h1>
        </>
    );

    function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();

        try {
            fetch("/api/lti/submit-assignment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ltik: searchParams.get("ltik"),
                    repoUrl: repoUrl,
                }),
            }).then((res) => {
                if (res.status > 200 && res.status < 300) {
                    setRepoUrl("");
                    setMessage("Entregado con éxito");
                } else {
                    setMessage("Ocurrió un error");
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    const renderSubmitForm = (
        <div className="repoSubmit">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={repoUrl}
                    placeholder="URL del repositorio"
                    onChange={(e) => setRepoUrl(e.target.value)}
                />
                <button type="submit">Entregar</button>
                <div className="message">{message ? <p>{message}</p> : null}</div>
            </form>
        </div>
    );

    if (isLoading) {
        return <LoadingSpinner />;
    } else if (apiResponseCode > 200 && apiResponseCode < 300) {
        return renderSubmitForm;
    } else {
        return renderUnauthorized;
    }
}

export default LaunchApp;
