import {
    LogOut,
    UserCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function Navbar() {

    const navigate = useNavigate();

    const {
        username,
        logout,
    } = useAuth();


    const handleLogout = () => {

        logout();

        navigate("/login");
    };


    return (
        <header className="navbar">

            <div
                className="brand"
                onClick={() => navigate("/dashboard")}
            >
                <div className="brand-icon">
                    AI
                </div>

                <div>
                    <h2>InterviewAI</h2>
                    <span>Preparation Platform</span>
                </div>
            </div>


            <div className="navbar-right">

                <div className="user-info">
                    <UserCircle size={20} />

                    <span>
                        {username}
                    </span>
                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={18} />
                    Logout
                </button>

            </div>

        </header>
    );
}