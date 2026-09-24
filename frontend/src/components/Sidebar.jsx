import {
    LayoutDashboard,
    Code2,
    User,
    BrainCircuit,
    Home,
} from "lucide-react";

import {
    NavLink,
} from "react-router-dom";

export default function Sidebar() {

    const links = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            to: "/domains",
            label: "Practice",
            icon: Code2,
        },
        {
            to: "/profile",
            label: "Profile",
            icon: User,
        },
    ];


    return (
        <aside className="sidebar">

            <div className="sidebar-section">

                <p className="sidebar-title">
                    MENU
                </p>


                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >
                    <Home size={19} />
                    Dashboard
                </NavLink>


                {links.slice(1).map(
                    ({
                         to,
                         label,
                         icon: Icon,
                     }) => (

                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `sidebar-link ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            <Icon size={19} />
                            {label}
                        </NavLink>
                    )
                )}

            </div>


            <div className="sidebar-ai-card">

                <BrainCircuit size={28} />

                <h4>
                    AI-Powered Evaluation
                </h4>

                <p>
                    Get intelligent feedback
                    on your interview answers.
                </p>

            </div>

        </aside>
    );
}