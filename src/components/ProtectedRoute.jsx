import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified and we have a role, check access
    if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
        // Role not authorized, redirect to home
        return <Navigate to="/" replace />;
    }

    // Render children if provided (wrapper mode), otherwise Outlet (layout mode)
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
