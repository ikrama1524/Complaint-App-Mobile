import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authService } from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await storage.getToken();
            const userData = await storage.getUser();

            if (token && userData) {
                setUser(userData);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (identifier, password, role = 'citizen') => {
        try {
            let authData;
            if (role === 'admin') {
                authData = await authService.loginAdmin(identifier, password);
            } else if (role === 'super-admin') {
                authData = await authService.loginSuperAdmin(identifier, password);
            } else {
                authData = await authService.login(identifier, password);
            }

            // Save token and user data
            await storage.saveToken(authData.token);

            const userData = {
                id: authData.userId,
                fullName: authData.fullName,
                email: authData.email,
                role: authData.role
            };

            await storage.saveUser(userData);
            setUser(userData);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    const register = async (userData) => {
        try {
            const authData = await authService.register(userData);

            // Auto-login after registration
            await storage.saveToken(authData.token);

            const user = {
                id: authData.userId,
                fullName: authData.fullName,
                email: authData.email,
                role: authData.role
            };

            await storage.saveUser(user);
            setUser(user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed. Please try again.'
            };
        }
    };

    const logout = async () => {
        try {
            await storage.clearAll();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
