import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  created_at: string;
}

interface AuthError {
  message: string;
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  userRole: 'admin' | 'super_admin' | 'patient' | null;
  signUp: (
      email: string,
      password: string,
      fullName: string,
      role?: 'admin' | 'patient'
  ) => Promise<{ error: AuthError }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'super_admin' | 'patient' | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData.user);
      setUserRole(userData.role);
    }
    setIsLoading(false);
  }, []);

  const signUp = async (
      email: string,
      password: string,
      fullName: string,
      role: 'admin' | 'patient' = 'patient'
  ) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: { message: data.error || 'Registration failed' } };
      }

      return { error: null };
    } catch (err) {
      console.error('SignUp error:', err);
      return { error: { message: 'Network or server error' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        return { error: { message: data.error || 'Login failed' } };
      }

      // 🔥 Fix: Store JWT token
      localStorage.setItem('token', data.token); // Ensure token is saved properly

      const userData = {
        id: data.id || 'unknown',
        fullName: data.fullName,
        email,
        created_at: new Date().toISOString(),
      };

      setUser(userData);
      setUserRole(data.role);
      localStorage.setItem('currentUser', JSON.stringify({ user: userData, role: data.role }));
      console.log('SignIn success:', data);
      // Redirect based on role
      const dashboardPath = data.role === "patient" ? "/patient/dashboard" : "/admin/dashboard";
      window.location.href = dashboardPath;

      return { error: null };
    } catch (err) {
      console.error('SignIn error:', err);
      return { error: { message: 'Network or server error' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    isLoading,
    userRole,
    signUp,
    signIn,
    signOut,
  };

  // ✅ This return is required
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
