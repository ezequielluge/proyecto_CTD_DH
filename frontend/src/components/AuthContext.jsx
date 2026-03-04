import React, { createContext, useState } from 'react'
import Swal from 'sweetalert2';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(null);

        Swal.fire({
            title: '¡Sesión cerrada!',
            icon: 'success',
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#2FBF71'
        })

    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}