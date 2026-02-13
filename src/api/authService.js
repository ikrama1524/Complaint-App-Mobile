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

    // Admin (Corporator) login
    async loginAdmin(identifier, password) {
        const response = await api.post('/auth/admin/login', {
            identifier,
            password
        });
        return response.data.data;
    },

    // Super Admin login
    async loginSuperAdmin(identifier, password) {
        const response = await api.post('/auth/super-admin/login', {
            identifier,
            password
        });
        return response.data.data;
    },
};
