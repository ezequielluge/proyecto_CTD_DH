import React, { useContext } from 'react'
import { AuthContext } from './AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '../config/paths';

const ProtectedRoute = ({ children, role }) => {
    const { user, isAuthenticated, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    if (loading)
        return <div className="spinner-border"></div>;

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    if (role && user?.role !== role) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />
    }

    return children;
}

export default ProtectedRoute