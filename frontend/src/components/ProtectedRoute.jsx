import React, { useContext } from 'react'
import { AuthContext } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to='/login' state={{ from: location}} replace />;
    }

    return children;
}

export default ProtectedRoute