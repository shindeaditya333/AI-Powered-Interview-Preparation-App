import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    MessageSquare,
    Trophy,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getInterviewResult,
} from "../services/interviewService";

import LoadingSpinner from "../components/LoadingSpinner";


export default function Results() {

    const {
        interviewId,
    } = useParams();

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const [result, setResult] =
        useState(
            location.state?.result || null
        );

    const [loading, setLoading] =
        useState(!result);


    useEffect(() => {

        if (result) {
            return;
        }

        const loadResult = async () => {

            try {

                const data =
                    await getInterviewResult(
                        interviewId
                    );

                setResult(data);

            } finally {

                setLoading(false);
            }
        };

        loadResult();

    }, [interviewId, result]);


    if (loading) {

        return (
            <LoadingSpinner
                text="Loading your results..."
            />
        );
    }


    if (!result) {

        return (
            <div className="empty-state">
                Unable to load results.
            </div>
        );
    }


    return (
        <div>

            <div className="page-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    <ArrowLeft size={18} />
                    Dashboard
                </button>

                <p className="eyebrow">
                    INTERVIEW COMPLETE
                </p>

                <h1>
                    Your Interview Results
                </h1>

                <p>
                    Here's how you performed.
                </p>

            </div>


            <div className="result-summary">

                <div className="result-score">

                    <Trophy size={30} />

                    <span>
                        Overall Score
                    </span>

                    <strong>
                        {result.percentage}%
                    </strong>

                    <small>
                        {result.totalScore} points
                    </small>

                </div>


                <div className="result-stat">

                    <span>
                        Questions
                    </span>

                    <strong>
                        {result.totalQuestions}
                    </strong>

                </div>


                <div className="result-stat">

                    <span>
                        Answered
                    </span>

                    <strong>
                        {result.answeredQuestions}
                    </strong>

                </div>


                <div className="result-stat">

                    <span>
                        Domain
                    </span>

                    <strong>
                        {result.domain}
                    </strong>

                </div>

            </div>


            <div className="results-section">

                <h2>
                    Question Review
                </h2>


                <div className="answer-list">

                    {result.answers?.map(
                        (item, index) => {

                            const isMCQ =
                                item.correctOption != null;

                            const isVideo =
                                item.videoUrl != null;


                            return (
                                <div
                                    className="answer-review"
                                    key={item.id}
                                >

                                    <div className="answer-review-header">

                                        <div className="question-number">
                                            {index + 1}
                                        </div>


                                        <div>

                                            <h3>
                                                {item.question}
                                            </h3>


                                            <span>
                                                Your answer:
                                            </span>

                                            <p>
                                                {item.answer}
                                                {item.correctOption != null &&
                                                    ` — ${
                                                        item.answer === "A"
                                                            ? item.optionA
                                                            : item.answer === "B"
                                                                ? item.optionB
                                                                : item.answer === "C"
                                                                    ? item.optionC
                                                                    : item.optionD
                                                    }`
                                                }
                                            </p>

                                            {isVideo && item.videoUrl && (
                                                <div style={{ marginTop: "12px" }}>

                                                    <strong>
                                                        Recorded Answer
                                                    </strong>

                                                    <video
                                                        controls
                                                        src={`http://localhost:8080${item.videoUrl}`}
                                                        style={{
                                                            display: "block",
                                                            width: "100%",
                                                            maxWidth: "600px",
                                                            marginTop: "8px",
                                                            borderRadius: "10px",
                                                        }}
                                                    />

                                                </div>
                                            )}

                                            <div className="mt-3 font-semibold">
                                                Score: {item.score}/10
                                            </div>


                                            {isMCQ && (
                                                <>
                                                    <span>
                                                        Correct answer:
                                                    </span>

                                                    <p>
                                                        {item.correctOption} — {item.correctAnswer}
                                                    </p>
                                                </>
                                            )}

                                        </div>

                                    </div>


                                    {!isMCQ && (
                                        <div className="feedback-box">

                                            <MessageSquare
                                                size={18}
                                            />

                                            <div>

                                                <strong>
                                                    AI Feedback
                                                </strong>

                                                <p>
                                                    {item.feedback}
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                </div>
                            );
                        }
                    )}

                </div>

            </div>

        </div>
    );
}