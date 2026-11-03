import React from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../auth/session";

/**
 * Hides staff pages from users without the right role. This is only for UX:
 * the real check happens in the API, which rejects requests without a valid token/role.
 */
const ProtectedRoute = ({ roles, children }) => {
    const session = getSession();
    if (!session) return <Navigate to="/" replace />;
    if (roles && !roles.includes(session.role)) return <Navigate to="/tables" replace />;
    return children;
};

export default ProtectedRoute;
