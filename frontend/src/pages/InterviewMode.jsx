import {
    ArrowLeft,
    Mic,
    Video,
    FileText,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";


export default function InterviewMode() {

    const {
        domainId,
    } = useParams();

    const navigate =
        useNavigate();


    return (
        <div className="mode-page">

            <button
                className="back-button"
                onClick={() =>
                    navigate("/domains")
                }
            >
                <ArrowLeft size={18} />
                Back
            </button>


            <div className="mode-header">

                <p className="eyebrow">
                    INTERVIEW MODE
                </p>

                <h1>
                    Choose Interview Mode
                </h1>

                <p>
                    Select how you want to practice your interview.
                </p>

            </div>


            <div className="mode-grid">

                {/* TEXT */}

                <button
                    className="mode-card"
                    onClick={() =>
                        navigate(
                            `/mock-interview/${domainId}`
                        )
                    }
                >

                    <div className="mode-icon">
                        <FileText size={30} />
                    </div>

                    <h2>
                        Text Interview
                    </h2>

                    <p>
                        Answer MCQ and descriptive questions using text.
                    </p>

                    <span>
                        Start Text Interview →
                    </span>

                </button>


                {/* AUDIO */}

                <button
                    className="mode-card"
                    onClick={() =>
                        navigate(
                            `/audio-interview/${domainId}`
                        )
                    }
                >

                    <div className="mode-icon">
                        <Mic size={30} />
                    </div>

                    <h2>
                        Audio Interview
                    </h2>

                    <p>
                        Listen to the question and answer using your microphone.
                    </p>

                    <span>
                        Start Audio Interview →
                    </span>

                </button>


                {/* VIDEO */}

                <button
                    className="mode-card"
                    onClick={() =>
                        navigate(
                            `/video-interview/${domainId}`
                        )
                    }
                >

                    <div className="mode-icon">
                        <Video size={30} />
                    </div>

                    <h2>
                        Video Interview
                    </h2>

                    <p>
                        Practice a live camera-based interview.
                    </p>

                    <span>
                        Start Video Interview →
                    </span>

                </button>

            </div>

        </div>
    );
}