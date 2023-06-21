import { Component } from "react";
import "./launch-app.css";
import LoadingSpinner from "../components/loading-spinner/loading-spinner";

class LaunchApp extends Component {
    state = {
        isLoading: true,
        auth: 401,
    };

    private searchParams = new URLSearchParams(document.location.search);

    async checkAuth(searchParams: URLSearchParams): Promise<number> {
        try {
            let res = await fetch(`/api/lti/launch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ltik: searchParams.get("ltik"),
                }),
            });
            await res.json();

            return res.status;
        } catch (err) {
            console.log(err);
            return 500;
        }
    }

    async componentDidMount() {
        const response = await this.checkAuth(this.searchParams);
        this.setState({ auth: response, isLoading: false });
    }

    private doRender(): JSX.Element {
        if (this.state.auth < 200 || this.state.auth > 299) {
            return (
                <>
                    <h1>No estás autorizado para acceder a este recurso</h1>
                    <p>{this.state.auth}</p>
                </>
            );
        }

        return (
            <>
                <h1>AaaAAAA</h1>
            </>
        );
    }

    render() {
        return (
            <>
                {this.state.isLoading ? (
                    <div>
                        <LoadingSpinner />
                    </div>
                ) : (
                    this.doRender()
                )}
            </>
        );
    }
}

export default LaunchApp;
