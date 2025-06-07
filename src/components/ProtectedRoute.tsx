import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.log("No token found, redirecting to login...");
        return <Navigate to="/login" />;
    }

    try {
        // ✅ Decode JWT and verify role
        const user = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded User:", user); // ✅ Debugging log

        if (!user.role) {
            console.log("Role missing in token, redirecting to login...");
            return <Navigate to="/login" />;
        }

        const isAdmin = user.role === "admin";

        // ✅ Redirect based on role
        if (isAdmin && window.location.pathname.startsWith("/patient")) {
            return <Navigate to="/admin/dashboard" />;
        }
        if (!isAdmin && window.location.pathname.startsWith("/admin")) {
            return <Navigate to="/patient/dashboard" />;
        }

        return children;
    } catch (error) {
        console.log("Error decoding token:", error);
        return <Navigate to="/login" />;
    }
};

export default ProtectedRoute;