import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    BrainCircuit,
    Camera,
    Square,
    Send,
    Volume2,
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
    uploadVideo,
    getVideoQuestionsByDomain,
} from "../services/interviewService";

export default function VideoInterview() {

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

    const [uploading, setUploading] =
        useState(false);

    const [finishing, setFinishing] =
        useState(false);

    const [answerHistory, setAnswerHistory] =
        useState({});


    const videoRef =
        useRef(null);

    const mediaRecorderRef =
        useRef(null);

    const videoChunksRef =
        useRef([]);

    const streamRef =
        useRef(null);

    const pendingSaveRef =
        useRef(null);


    // =====================================================
    // INITIALIZE INTERVIEW
    // =====================================================

    useEffect(() => {

        const initialize =
            async () => {

                try {

                    const interviewData =
                        await startInterview(
                            domainId,
                            "VIDEO"
                        );

                    const questionData =
                        await getVideoQuestionsByDomain(
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
                        "Unable to start video interview"
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

            if (recordingUrl) {

                URL.revokeObjectURL(
                    recordingUrl
                );
            }
        };

    }, [domainId, navigate]);


    // =====================================================
    // QUESTION CHANGE
    // =====================================================

    useEffect(() => {

        if (
            questions.length === 0
        ) {
            return;
        }


        resetRecording();


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

    }, [
        currentIndex,
        questions,
    ]);


    // =====================================================
    // CAMERA
    // =====================================================

    useEffect(() => {

        if (loading || questions.length === 0) {
            return;
        }


        const startCamera =
            async () => {

                try {

                    const stream =
                        await navigator
                            .mediaDevices
                            .getUserMedia({
                                video: true,
                                audio: true,
                            });


                    streamRef.current =
                        stream;


                    if (videoRef.current) {

                        videoRef.current.srcObject =
                            stream;
                    }

                } catch (error) {

                    toast.error(
                        "Camera and microphone permission are required."
                    );
                }
            };


        startCamera();


        return () => {

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );
            }
        };

    }, [
        loading,
        questions.length,
    ]);


    if (loading) {

        return (
            <LoadingSpinner
                text="Preparing video interview..."
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


    // =====================================================
    // SPEAK QUESTION
    // =====================================================

    const speakQuestion = () => {

        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                currentQuestion.question
            );


        speech.rate = 0.9;

        speech.pitch = 1;

        speech.volume = 1;


        window.speechSynthesis.speak(
            speech
        );
    };


    // =====================================================
    // START RECORDING
    // =====================================================

    const startRecording = async () => {

        try {

            let stream =
                streamRef.current;


            if (!stream) {

                stream =
                    await navigator
                        .mediaDevices
                        .getUserMedia({
                            video: true,
                            audio: true,
                        });

                streamRef.current =
                    stream;

                if (videoRef.current) {

                    videoRef.current.srcObject =
                        stream;
                }
            }


            videoChunksRef.current =
                [];


            const recorder =
                new MediaRecorder(
                    stream,
                    {
                        videoBitsPerSecond: 600000,
                        audioBitsPerSecond: 48000,
                    }
                );


            mediaRecorderRef.current =
                recorder;


            recorder.ondataavailable =
                (event) => {

                    if (
                        event.data.size > 0
                    ) {

                        videoChunksRef.current
                            .push(
                                event.data
                            );
                    }
                };


            recorder.onstop =
                () => {

                    const blob =
                        new Blob(
                            videoChunksRef.current,
                            {
                                type:
                                    "video/webm",
                            }
                        );


                    const url =
                        URL.createObjectURL(
                            blob
                        );


                    if (recordingUrl) {

                        URL.revokeObjectURL(
                            recordingUrl
                        );
                    }


                    setRecordedBlob(
                        blob
                    );

                    setRecordingUrl(
                        url
                    );
                };


            recorder.start();

            setRecording(true);

        } catch (error) {

            toast.error(
                "Camera and microphone permission are required."
            );
        }
    };


    // =====================================================
    // STOP RECORDING
    // =====================================================

    const stopRecording = () => {

        if (
            mediaRecorderRef.current &&
            recording
        ) {

            mediaRecorderRef.current.stop();

            setRecording(false);
        }
    };


    // =====================================================
    // RESET RECORDING
    // =====================================================

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
    };


    // =====================================================
    // SAVE CURRENT VIDEO
    // =====================================================

    const saveCurrentAnswer =
        async () => {

            if (!recordedBlob) {

                toast.error(
                    "Please record your answer first."
                );

                return false;
            }


            const savePromise =
                (async () => {

                    try {

                        const uploadResult =
                            await uploadVideo(
                                recordedBlob
                            );


                        const videoUrl =
                            uploadResult.url;


                        await submitAnswer({

                            interviewId:
                            interview.id,

                            questionId:
                                null,

                            audioQuestionId:
                                null,

                            videoQuestionId:
                            currentQuestion.id,

                            answer:
                                "",

                            videoUrl:
                            videoUrl,
                        });


                        setAnswerHistory(
                            previous => ({
                                ...previous,

                                [currentQuestion.id]: {
                                    videoUrl:
                                    videoUrl,
                                },
                            })
                        );


                        return true;

                    } catch (error) {

                        toast.error(
                            error.response?.data?.message ||
                            "Unable to save video answer"
                        );

                        return false;
                    }

                })();


            pendingSaveRef.current =
                savePromise;


            const result =
                await savePromise;


            if (
                pendingSaveRef.current ===
                savePromise
            ) {

                pendingSaveRef.current =
                    null;
            }


            return result;
        };


    // =====================================================
    // NEXT
    // =====================================================

    const handleNext = async () => {

        if (recordedBlob) {
            saveCurrentAnswer();
        }

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(previous => previous + 1);
        }
    };


    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious = () => {

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


    // =====================================================
    // FINISH
    // =====================================================

    const handleFinish = async () => {

        if (finishing) {
            return;
        }

        setFinishing(true);

        try {

            if (recordedBlob) {
                await saveCurrentAnswer();
            }

            const result =
                await completeInterview(interview.id);

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


    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="interview-page">

            {/* HEADER */}

            <div className="interview-header">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/domains")
                    }
                    disabled={finishing}
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
                            {" "}Video Interview
                        </h2>

                        <span>
                            Answer using your camera and voice
                        </span>

                    </div>

                </div>

            </div>


            {/* PROGRESS */}

            <div className="audio-progress">

                Question{" "}
                {currentIndex + 1}
                {" "}of{" "}
                {questions.length}

            </div>


            {/* QUESTION */}

            <div className="question-card">

                <div className="question-meta">

                    <span className="question-type">
                        VIDEO
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
                    disabled={recording || finishing}
                >
                    <Volume2 size={18} />
                    Play Question
                </button>


                {/* CAMERA */}

                {/* VIDEO SECTION */}

                <div className="video-recorder">

                    <div className="video-sections">

                        {/* LIVE CAMERA */}

                        <div className="video-section">

                            <div className="video-section-title">
                                Live Camera
                            </div>

                            <div className="video-box">

                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                />

                            </div>

                            <div className="camera-status">
                                <span className="camera-status-dot"></span>
                                Camera is on
                            </div>

                        </div>


                        {/* YOUR RECORDING */}

                        <div className="video-section">

                            <div className="video-section-title">
                                Your Recording
                            </div>

                            <div className="video-box">

                                {recordingUrl ? (

                                    <video
                                        controls
                                        src={recordingUrl}
                                    />

                                ) : (

                                    <div className="video-placeholder">
                                        Your recorded answer will appear here
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>


                    {/* RECORD BUTTON */}

                    <div className="recording-controls">

                        {!recording ? (

                            <button
                                className="primary-button record-button"
                                onClick={startRecording}
                                disabled={finishing}
                            >
                                <Camera size={19} />
                                Start Recording
                            </button>

                        ) : (

                            <button
                                className="primary-button stop-record-button"
                                onClick={stopRecording}
                                disabled={finishing}
                            >
                                <Square size={18} />
                                Stop Recording
                            </button>

                        )}

                        {recording && (

                            <div className="recording-status">

                                <span className="recording-dot"></span>

                                Recording...

                            </div>

                        )}

                    </div>

                </div>

            </div>


            {/* FOOTER */}

            <div className="interview-footer">

                <button
                    className="back-button"
                    onClick={
                        handlePrevious
                    }
                    disabled={
                        currentIndex === 0 ||
                        recording ||
                        finishing
                    }
                >
                    <ArrowLeft size={18} />
                    Previous
                </button>


                {currentIndex ===
                questions.length - 1 ? (

                    <button
                        className="primary-button"
                        onClick={
                            handleFinish
                        }
                        disabled={
                            recording ||
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
                            finishing
                        }
                    >

                        Next
                        <ArrowRight
                            size={18}
                        />

                    </button>
                )}

            </div>

        </div>
    );
}