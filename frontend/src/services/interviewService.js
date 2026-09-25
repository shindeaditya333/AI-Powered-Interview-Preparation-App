import api from "./api";
import { upload } from "@vercel/blob/client";

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

export const uploadVideo = async (blob) => {

    const result = await upload(
        "video-answer.webm",
        blob,
        {
            access: "private",
            handleUploadUrl: "/api/blob/upload",
            multipart: true,
        }
    );

    return {
        url: result.url,
    };
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