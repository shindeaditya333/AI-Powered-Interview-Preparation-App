import api from "./api";

export const getQuestionsByDomain = async (domainId) => {
    const response = await api.get(
        `/questions/domain/${domainId}`
    );

    return response.data;
};

export const getQuestionsByDifficulty = async (
    domainId,
    difficulty
) => {
    const response = await api.get(
        `/questions/domain/${domainId}/difficulty/${difficulty}`
    );

    return response.data;
};