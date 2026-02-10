import api from './axios';

export const authService = {
    // Citizen login
    async login(identifier, password) {
        const response = await api.post('/auth/citizen/login', {
            identifier,
            password
        });
        return response.data.data; // Returns { token, userId, fullName, email, role }
    },

    // Citizen registration
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data.data;
    },
};
