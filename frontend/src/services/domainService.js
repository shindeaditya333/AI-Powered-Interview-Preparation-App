import api from "./api";

export const getDomains = async () => {
    const response = await api.get("/domains");
    return response.data;
};