import {
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

export default function Home() {

    const navigate = useNavigate();


    return (
        <div className="landing-page">

            <nav className="landing-navbar">

                <div className="brand">

                    <div className="brand-icon">
                        AI
                    </div>

                    <h2>InterviewAI</h2>

                </div>


                <div className="landing-actions">

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Get Started
                    </button>

                </div>

            </nav>


            <section className="hero">

                <div className="hero-content">

                    <div className="badge">
                        <Sparkles size={15} />
                        AI-Powered Interview Preparation
                    </div>


                    <h1>
                        Prepare for interviews
                        <span> with confidence.</span>
                    </h1>


                    <p>
                        Practice technical questions,
                        take realistic mock interviews,
                        and receive AI-powered feedback
                        on your answers.
                    </p>


                    <div className="hero-buttons">

                        <button
                            className="primary-button large-button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Start Practicing
                            <ArrowRight size={19} />
                        </button>


                        <button
                            className="secondary-button large-button"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Sign In
                        </button>

                    </div>


                    <div className="hero-features">

                        <div>
                            <CheckCircle2 size={18} />
                            Technical Questions
                        </div>

                        <div>
                            <CheckCircle2 size={18} />
                            AI Evaluation
                        </div>

                        <div>
                            <CheckCircle2 size={18} />
                            Detailed Results
                        </div>

                    </div>

                </div>


                <div className="hero-visual">

                    <div className="ai-card">

                        <div className="ai-card-header">

                            <BrainCircuit size={26} />

                            <span>
                                AI Interview
                            </span>

                        </div>


                        <div className="mock-question">

                            <span>
                                QUESTION
                            </span>

                            <h3>
                                Explain the difference
                                between ArrayList
                                and LinkedList.
                            </h3>

                        </div>


                        <div className="mock-answer">

                            <span>
                                AI EVALUATION
                            </span>

                            <div className="score-circle">
                                8.5
                            </div>

                            <p>
                                Strong understanding
                                with a clear explanation
                                of the underlying data
                                structures.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}