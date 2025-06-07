import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    session: any;
    isLoading: boolean;
    userRole: string | null;
    fetchUser: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, name: string, role?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found, setting user to null");
                setUser(null);
                setUserRole(null);
                return;
            }

            const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/me", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            console.log("API Response:", data);

            if (res.ok && data.user) {
                console.log("Setting User:", data.user);
                setUser(data.user);
                setUserRole(data.user.role);
            } else {
                console.log("User data invalid, setting user to null");
                setUser(null);
                setUserRole(null);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setUser(null);
            setUserRole(null);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        localStorage.setItem("token", data.token);
        await fetchUser();
    };

    const signOut = async () => {
        localStorage.removeItem("token");
        setUser(null);
        setUserRole(null);
    };

    const signUp = async (email: string, password: string, name: string, role = "patient") => {
        const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name, role }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        await signIn(email, password);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, session, isLoading, userRole, fetchUser, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};