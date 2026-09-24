import {
    Outlet,
} from "react-router-dom";

export default function AuthLayout() {

    return (
        <div className="auth-page">

            <div className="auth-brand">

                <div className="brand-icon large">
                    AI
                </div>

                <h1>
                    InterviewAI
                </h1>

                <p>
                    Practice smarter.
                    Interview better.
                </p>

            </div>


            <Outlet />

        </div>
    );
}