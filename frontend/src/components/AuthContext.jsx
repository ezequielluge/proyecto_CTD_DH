import { createContext, useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { ROUTES } from '../config/paths';
import { useNavigate } from 'react-router-dom';
import { AUTH_ENDPOINT, TOKEN_VALIDATION_ENDPOINT } from '../config/config';

import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Token validation
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await api(
                    TOKEN_VALIDATION_ENDPOINT,
                    { method: 'POST' }
                );

                if (res.ok) {
                    const userData = await res.json();
                    setUser({ ...userData, token });
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error validando sesión.", error);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        }

        checkToken();
    }, []);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        setUser(userData);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        Swal.fire({
            title: '¡Sesión cerrada!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#2FBF71'
        });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, loading, logout }}>
            {!loading ? children : (
                <div className="spinner">Cargando sesión...</div>
            )}
        </AuthContext.Provider>
    );
}