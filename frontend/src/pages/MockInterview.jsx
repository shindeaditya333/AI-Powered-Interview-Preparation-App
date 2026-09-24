import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    CheckCircle2,
    Send,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    startInterview,
    submitAnswer,
    completeInterview,
} from "../services/interviewService";

import {
    getQuestionsByDomain,
} from "../services/questionService";

import QuestionCard from "../components/QuestionCard";
import ProgressCard from "../components/ProgressCard";
import LoadingSpinner from "../components/LoadingSpinner";


export default function MockInterview() {

    const {
        domainId,
    } = useParams();

    const navigate = useNavigate();


    const [interview, setInterview] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [answer, setAnswer] =
        useState("");

    const [answerHistory, setAnswerHistory] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);


    useEffect(() => {

        const initializeInterview =
            async () => {

                try {

                    const interviewData =
                        await startInterview(
                            domainId,
                            "MIXED"
                        );

                    const questionData =
                        await getQuestionsByDomain(
                            domainId
                        );


                    setInterview(
                        interviewData
                    );

                    setQuestions(
                        questionData
                    );

                } catch (error) {

                    toast.error(
                        error.response?.data?.message ||
                        "Unable to start interview"
                    );

                    navigate("/domains");

                } finally {

                    setLoading(false);
                }
            };


        initializeInterview();

    }, [domainId, navigate]);


    if (loading) {

        return (
            <LoadingSpinner
                text="Preparing your interview..."
            />
        );
    }


    if (
        !interview ||
        questions.length === 0
    ) {

        return (
            <div className="empty-state">

                <h3>
                    No questions available
                </h3>

                <button
                    className="primary-button"
                    onClick={() =>
                        navigate("/domains")
                    }
                >
                    Back to Domains
                </button>

            </div>
        );
    }


    const currentQuestion =
        questions[currentIndex];


    const handleAnswerChange = (value) => {

        setAnswer(value);

        setAnswerHistory((previous) => ({
            ...previous,
            [currentQuestion.id]: value,
        }));
    };

    // =====================================================
    // NEXT
    // =====================================================

    const handleNext = () => {

        // Store current answer locally
        const updatedHistory = {
            ...answerHistory,
            [currentQuestion.id]: answer.trim(),
        };

        setAnswerHistory(updatedHistory);


        // If last question, don't submit here
        if (
            currentIndex ===
            questions.length - 1
        ) {
            return;
        }


        // Get next question
        const nextQuestion =
            questions[currentIndex + 1];


        // Move to next question
        setCurrentIndex(
            (previous) =>
                previous + 1
        );


        // Restore previously stored answer
        setAnswer(
            updatedHistory[
                nextQuestion.id
                ] || ""
        );
    };


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious = () => {

        // Store current answer locally
        const updatedHistory = {
            ...answerHistory,
            [currentQuestion.id]: answer.trim(),
        };

        setAnswerHistory(updatedHistory);


        if (currentIndex === 0) {
            return;
        }


        // Get previous question
        const previousQuestion =
            questions[currentIndex - 1];


        // Move to previous question
        setCurrentIndex(
            (previous) =>
                previous - 1
        );


        // Restore previous answer
        setAnswer(
            updatedHistory[
                previousQuestion.id
                ] || ""
        );
    };

    const handleFinish = async () => {

        // Store current question's answer
        const updatedHistory = {
            ...answerHistory,
            [currentQuestion.id]: answer.trim(),
        };

        setAnswerHistory(updatedHistory);

        setSubmitting(true);

        try {

            // Submit only answered questions
            for (const question of questions) {

                const candidateAnswer =
                    updatedHistory[
                        question.id
                        ]?.trim();

                // Don't submit unanswered questions
                if (!candidateAnswer) {
                    continue;
                }


                await submitAnswer({
                    interviewId:
                    interview.id,

                    questionId:
                    question.id,

                    answer:
                    candidateAnswer,
                });
            }


            // Complete the interview
            const finalResult =
                await completeInterview(
                    interview.id
                );


            navigate(
                `/results/${interview.id}`,
                {
                    state: {
                        result: finalResult,
                    },
                }
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Unable to complete interview"
            );

        } finally {

            setSubmitting(false);
        }
    };


    return (
        <div className="interview-page">

            <div className="interview-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/domains")
                    }
                >
                    <ArrowLeft size={18} />
                    Exit
                </button>


                <div className="interview-title">

                    <div className="interview-ai-icon">
                        <BrainCircuit
                            size={22}
                        />
                    </div>

                    <div>
                        <h2>
                            {interview.domainName}
                            {" "}Interview
                        </h2>

                        <span>
                            AI-powered evaluation
                        </span>
                    </div>

                </div>

            </div>


            <ProgressCard
                current={currentIndex}
                total={questions.length}
            />


            <div className="interview-content">

                <QuestionCard
                    question={
                        currentQuestion
                    }
                    answer={answer}
                    setAnswer={handleAnswerChange}
                />


                <div className="interview-footer">

                    <div className="evaluation-note">

                        <CheckCircle2 size={17} />

                        Your answer will be evaluated after the interview.

                    </div>


                    <button
                        className="back-button"
                        onClick={handlePrevious}
                        disabled={
                            currentIndex === 0 ||
                            submitting
                        }
                    >
                        <ArrowLeft size={18} />
                        Previous
                    </button>


                    <button
                        className="primary-button"
                        onClick={
                            currentIndex === questions.length - 1
                                ? handleFinish
                                : handleNext
                        }
                        disabled={submitting}
                    >

                        {submitting
                            ? "Saving..."
                            : currentIndex === questions.length - 1
                                ? "Finish Interview"
                                : "Next"}

                        {currentIndex ===
                        questions.length - 1 ? (
                            <Send size={18} />
                        ) : (
                            <ArrowRight
                                size={18}
                            />
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
}