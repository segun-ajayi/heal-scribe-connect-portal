import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" />;

    // ✅ Decode JWT payload
    const user = JSON.parse(atob(token.split(".")[1]));
    const isAdmin = user.role === "admin";

    // ✅ Redirect based on role
    if (isAdmin && window.location.pathname.startsWith("/patient")) {
        return <Navigate to="/admin/dashboard" />;
    }

    if (!isAdmin && window.location.pathname.startsWith("/admin")) {
        return <Navigate to="/patient/dashboard" />;
    }

    return children;
};

export default ProtectedRoute;