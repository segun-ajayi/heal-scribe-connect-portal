// pages/Unauthorized.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
                You do not have permission to view this page.
            </p>
            <Button asChild>
                <Link to="/">Go to Home</Link>
            </Button>
        </div>
    );
};

export default Unauthorized;
