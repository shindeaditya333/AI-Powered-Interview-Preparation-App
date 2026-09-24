import {
    ArrowRight,
    BrainCircuit,
    Code2,
    Target,
    Trophy,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function Dashboard() {

    const navigate = useNavigate();

    const {
        username,
    } = useAuth();


    return (
        <div>

            <div className="page-header">

                <div>
                    <p className="eyebrow">
                        DASHBOARD
                    </p>

                    <h1>
                        Welcome back, {username}
                    </h1>

                    <p>
                        Continue your interview
                        preparation journey.
                    </p>
                </div>

            </div>


            <div className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon">
                        <Target size={22} />
                    </div>

                    <div>
                        <span>
                            Practice
                        </span>

                        <strong>
                            Unlimited
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <BrainCircuit size={22} />
                    </div>

                    <div>
                        <span>
                            AI Evaluation
                        </span>

                        <strong>
                            Gemini
                        </strong>
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        <Trophy size={22} />
                    </div>

                    <div>
                        <span>
                            Progress
                        </span>

                        <strong>
                            Start Now
                        </strong>
                    </div>

                </div>

            </div>


            <section className="dashboard-hero">

                <div>

                    <div className="dashboard-icon">
                        <Code2 size={28} />
                    </div>

                    <h2>
                        Ready for your next
                        interview?
                    </h2>

                    <p>
                        Choose a technical domain
                        and start an AI-powered
                        mock interview.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/domains")
                        }
                    >
                        Explore Domains
                        <ArrowRight size={18} />
                    </button>

                </div>


                <div className="dashboard-decoration">
                    <BrainCircuit size={150} />
                </div>

            </section>

        </div>
    );
}