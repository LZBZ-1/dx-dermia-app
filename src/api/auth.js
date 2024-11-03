import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const authApi = {
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        const userIdResponse = await axios.get(`${API_URL}/users/by-username/${credentials.username}`);
        return {
            ...response.data,
            userId: userIdResponse.data
        };
    },

    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    }
};