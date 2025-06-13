// components/ProtectedRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: Array<'admin' | 'super_admin' | 'patient'>;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, userRole, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user || !allowedRoles.includes(userRole!)) {
        console.log('Allowed: ', allowedRoles)
        console.log('Role: ', userRole)
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
