import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    Mic,
    Square,
    Volume2,
    Send,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import LoadingSpinner from "../components/LoadingSpinner";

import {
    startInterview,
    submitAnswer,
    completeInterview,
    uploadAudio,
    getAudioQuestionsByDomain,
} from "../services/interviewService";

export default function AudioInterview() {

    const {
        domainId,
    } = useParams();

    const navigate =
        useNavigate();


    const [interview, setInterview] =
        useState(null);

    const [questions, setQuestions] =
        useState([]);

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [recording, setRecording] =
        useState(false);

    const [recordedBlob, setRecordedBlob] =
        useState(null);

    const [recordingUrl, setRecordingUrl] =
        useState("");

    const [transcript, setTranscript] =
        useState("");

    const [uploading, setUploading] =
        useState(false);

    const [finishing, setFinishing] = useState(false);

    const [answerHistory, setAnswerHistory] =
        useState({});


    const mediaRecorderRef =
        useRef(null);

    const audioChunksRef =
        useRef([]);

    const streamRef =
        useRef(null);


    useEffect(() => {

        const initialize =
            async () => {

                try {

                    const interviewData =
                        await startInterview(
                            domainId,
                            "AUDIO"
                        );


                    const questionData =
                        await getAudioQuestionsByDomain(
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
                        "Unable to start audio interview"
                    );

                    navigate("/domains");

                } finally {

                    setLoading(false);
                }
            };


        initialize();


        return () => {

            window.speechSynthesis.cancel();

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );
            }
        };

    }, [domainId, navigate]);


    useEffect(() => {

        if (
            questions.length === 0
        ) {
            return;
        }


        const question =
            questions[currentIndex];


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                question.question
            );


        speech.rate = 0.9;

        speech.pitch = 1;

        speech.volume = 1;


        window.speechSynthesis.speak(
            speech
        );


        resetRecording();

    }, [
        currentIndex,
        questions,
    ]);


    if (loading) {

        return (
            <LoadingSpinner
                text="Preparing audio interview..."
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
                        navigate(
                            "/domains"
                        )
                    }
                >
                    Back to Domains
                </button>

            </div>
        );
    }


    const currentQuestion =
        questions[currentIndex];


    const speakQuestion = () => {

        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                currentQuestion.question
            );


        speech.rate = 0.9;


        window.speechSynthesis.speak(
            speech
        );
    };


    const startRecording = async () => {

        try {

            const stream =
                await navigator.mediaDevices
                    .getUserMedia({
                        audio: true,
                    });


            streamRef.current =
                stream;


            const recorder =
                new MediaRecorder(
                    stream
                );


            mediaRecorderRef.current =
                recorder;


            audioChunksRef.current =
                [];


            recorder.ondataavailable =
                (event) => {

                    if (
                        event.data.size > 0
                    ) {

                        audioChunksRef.current
                            .push(
                                event.data
                            );
                    }
                };


            recorder.onstop =
                async () => {

                    const blob =
                        new Blob(
                            audioChunksRef.current,
                            {
                                type:
                                    "audio/webm",
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    setRecordedBlob(
                        blob
                    );

                    setRecordingUrl(
                        url
                    );


                    stream
                        .getTracks()
                        .forEach(
                            track =>
                                track.stop()
                        );
                };

            recorder.start();

            setRecording(true);

        } catch (error) {

            toast.error(
                "Microphone permission is required."
            );
        }
    };


    const stopRecording = () => {

        if (
            mediaRecorderRef.current &&
            recording
        ) {

            mediaRecorderRef.current.stop();
        }


        setRecording(false);
    };


    const resetRecording = () => {

        if (
            mediaRecorderRef.current &&
            recording
        ) {

            mediaRecorderRef.current.stop();
        }


        if (recordingUrl) {

            URL.revokeObjectURL(
                recordingUrl
            );
        }


        setRecording(false);

        setRecordedBlob(null);

        setRecordingUrl("");

        setTranscript("");
    };


    const saveCurrentAnswer =
        async () => {

            if (!recordedBlob) {

                toast.error(
                    "Please record your answer first."
                );

                return false;
            }


            setUploading(true);


            try {

                const uploadResult =
                    await uploadAudio(
                        recordedBlob
                    );


                const audioUrl =
                    uploadResult.url;


                const answerText =
                    transcript.trim();


                await submitAnswer({
                    interviewId: interview.id,
                    questionId: null,
                    audioQuestionId: currentQuestion.id,
                    answer: "",
                    audioUrl: audioUrl,
                });


                setAnswerHistory(
                    previous => ({
                        ...previous,
                        [currentQuestion.id]: {
                            transcript:
                            answerText,

                            audioUrl:
                            audioUrl,
                        },
                    })
                );


                return true;

            } catch (error) {

                toast.error(
                    error.response?.data?.message ||
                    "Unable to save audio answer"
                );

                return false;

            } finally {

                setUploading(false);
            }
        };


    const handleNext =
        async () => {

            if (recordedBlob) {

                const saved =
                    await saveCurrentAnswer();

                if (!saved) {
                    return;
                }
            }

            if (
                currentIndex <
                questions.length - 1
            ) {

                setCurrentIndex(
                    previous =>
                        previous + 1
                );
            }
        };


    const handlePrevious =
        () => {

            if (
                currentIndex === 0
            ) {
                return;
            }


            setCurrentIndex(
                previous =>
                    previous - 1
            );
        };


    const handleFinish = async () => {

        if (finishing) {
            return;
        }

        setFinishing(true);

        try {

            // Save answer only if the current question was answered
            if (recordedBlob) {

                const saved =
                    await saveCurrentAnswer();

                if (!saved) {
                    setFinishing(false);
                    return;
                }
            }

            const result =
                await completeInterview(
                    interview.id
                );

            navigate(
                `/results/${interview.id}`,
                {
                    state: {
                        result,
                    },
                }
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to complete interview"
            );

            setFinishing(false);
        }
    };


    return (
        <div className="interview-page">

            <div className="interview-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/domains"
                        )
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
                            {" "}Audio Interview
                        </h2>

                        <span>
                            Listen and answer using your voice
                        </span>

                    </div>

                </div>

            </div>


            <div className="audio-progress">

                Question{" "}
                {currentIndex + 1}
                {" "}of{" "}
                {questions.length}

            </div>


            <div className="question-card">

                <div className="question-meta">

                    <span className="question-type">
                        AUDIO
                    </span>

                    <span>
                        {currentQuestion.difficulty}
                    </span>

                </div>


                <h2>
                    {currentQuestion.question}
                </h2>


                <button
                    className="primary-button"
                    onClick={
                        speakQuestion
                    }
                >
                    <Volume2 size={18} />
                    Play Question
                </button>


                <div className="audio-recorder">

                    {!recording ? (

                        <button
                            className="primary-button"
                            onClick={
                                startRecording
                            }
                            disabled={uploading}
                        >
                            <Mic size={20} />
                            Start Recording
                        </button>

                    ) : (

                        <button
                            className="primary-button"
                            onClick={
                                stopRecording
                            }
                        >
                            <Square size={18} />
                            Stop Recording
                        </button>
                    )}


                    {recordingUrl && (

                        <audio
                            controls
                            src={recordingUrl}
                        />
                    )}


                    {transcript && (

                        <div className="transcript-box">

                            <strong>
                                Your speech:
                            </strong>

                            <p>
                                {transcript}
                            </p>

                        </div>
                    )}

                </div>

            </div>


            <div className="interview-footer">

                <button
                    className="back-button"
                    onClick={
                        handlePrevious
                    }
                    disabled={
                        currentIndex === 0 ||
                        recording ||
                        uploading
                    }
                >
                    <ArrowLeft size={18} />
                    Previous
                </button>


                {currentIndex ===
                questions.length - 1 ? (

                    <button
                        className="primary-button"
                        onClick={handleFinish}
                        disabled={
                            recording ||
                            uploading ||
                            finishing
                        }
                    >
                        {finishing ? (
                            <>
                                <span className="spinner"></span>
                                Evaluating...
                            </>
                        ) : (
                            <>
                                Finish Interview
                                <Send size={18} />
                            </>
                        )}
                    </button>

                ) : (

                    <button
                        className="primary-button"
                        onClick={
                            handleNext
                        }
                        disabled={
                            recording ||
                            uploading
                        }
                    >

                        {uploading
                            ? "Saving..."
                            : "Next"}

                        <ArrowRight
                            size={18}
                        />

                    </button>
                )}

            </div>

        </div>
    );
}