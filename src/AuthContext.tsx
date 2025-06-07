// src/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {},
    logout: async () => {},
    fetchUser: async () => {},
    register: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch(
                "https://iyawo-website-worker.mortalerror.workers.dev/me",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Failed to fetch user", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const res = await fetch(
            "https://iyawo-website-worker.mortalerror.workers.dev/login",
            {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        if (!res.ok) throw new Error("Login failed");

        await fetchUser();
    };

    const logout = async () => {
        await fetch(
            "https://iyawo-website-worker.mortalerror.workers.dev/logout",
            {
                method: "POST",
                credentials: "include",
            }
        );
        setUser(null);
    };

    const register = async (email: string, password: string, name: string) => {
        const res = await fetch(
            "https://iyawo-website-worker.mortalerror.workers.dev/register",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Registration failed");
        }

        // Optionally auto-login after register
        await login(email, password);
    };


    useEffect(() => {
        fetchUser(); // On initial load
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchUser, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
