import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

const normalizeUser = (user) => {
    if (!user) return null;
    return {
        ...user,
        isAdmin: user.isAdmin ?? user.role === 'ADMIN'
    };
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(normalizeUser(response.data));
                } catch (error) {
                    console.error("Auth check error:", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        const normalizedUser = normalizeUser(user);
        setUser(normalizedUser);
        return normalizedUser;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        const normalizedUser = normalizeUser(user);
        setUser(normalizedUser);
        return normalizedUser;
    };

    const logout = () => {
        const wasAdmin = user?.isAdmin || user?.role === 'ADMIN';
        localStorage.removeItem('token');
        setUser(null);
        return wasAdmin;
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await api.put('/users/me', updatedData);
            const normalizedUser = normalizeUser(response.data);
            setUser(normalizedUser);
            return normalizedUser;
        } catch (error) {
            console.error("User update failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
