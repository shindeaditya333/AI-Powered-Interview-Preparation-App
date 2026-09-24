import api from "./api";

export const startInterview = async (
    domainId,
    mode
) => {
    const response = await api.post(
        `/interviews/start?domainId=${domainId}&mode=${mode}`
    );

    return response.data;
};

export const submitAnswer = async (answerData) => {
    const response = await api.post(
        "/interviews/answer",
        answerData
    );

    return response.data;
};

export const completeInterview = async (interviewId) => {
    const response = await api.post(
        `/interviews/${interviewId}/complete`
    );

    return response.data;
};

export const getInterviewResult = async (interviewId) => {
    const response = await api.get(
        `/interviews/${interviewId}/result`
    );

    return response.data;
};

export const getAudioQuestionsByDomain = async (domainId) => {

    const response =
        await api.get(
            `/audio-questions/domain/${domainId}`
        );

    return response.data;
};

export const uploadAudio = async (audioBlob) => {
    const formData = new FormData();

    formData.append("file", audioBlob, "answer.webm");

    const response = await api.post(
        "/media/audio",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();

    formData.append("file", audioBlob, "answer.webm");

    const response = await api.post(
        "/transcription",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getVideoQuestionsByDomain = async (domainId) => {

    const response = await api.get(
        `/video-questions/domain/${domainId}`
    );

    return response.data;
};

export const uploadVideo = async (blob) => {

    const formData = new FormData();

    formData.append(
        "file",
        blob,
        "video-answer.webm"
    );

    const response = await api.post(
        "/media/video",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};