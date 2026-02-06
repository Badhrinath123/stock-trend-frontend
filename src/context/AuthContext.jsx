import { createContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (username, password) => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await api.post('/token', formData);
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        // Fetch user details immediately
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        return true;
    };

    const register = async (username, password, email) => {
        await api.post('/register', { username, password, email });
        return true;
    };

    const loginWithGoogle = async (googleToken) => {
        const response = await api.post('/auth/google', { token: googleToken });
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
