// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token found, setting user to null");
                setUser(null);
                return;
            }

            const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/me", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();
            console.log("Fetched User Data:", data);

            if (res.ok && data.user) {
                setUser(data.user);
            } else {
                console.log("User data invalid, setting user to null");
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        localStorage.setItem("token", data.token); // ✅ Store token
        await fetchUser(); // Fetch user after login
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const register = async (email: string, password: string, name: string) => {
        const res = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        await login(email, password);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchUser(); // ✅ Ensures the promise is resolved
        };

        fetchData();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);