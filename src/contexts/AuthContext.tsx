
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  userRole: 'admin' | 'super_admin' | 'patient' | null;
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'patient') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
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

// Mock users data
const mockUsers = [
  { id: '1', email: 'admin@example.com', password: 'admin123', role: 'super_admin' as const, fullName: 'Admin User' },
  { id: '2', email: 'patient@example.com', password: 'patient123', role: 'patient' as const, fullName: 'John Patient' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'super_admin' | 'patient' | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData.user);
      setUserRole(userData.role);
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'patient' = 'patient') => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return { error: { message: 'User already exists' } };
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      created_at: new Date().toISOString()
    };
    
    setUser(newUser);
    setUserRole(role);
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify({ user: newUser, role }));
    
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    if (!mockUser) {
      return { error: { message: 'Invalid email or password' } };
    }

    const userData = {
      id: mockUser.id,
      email: mockUser.email,
      created_at: new Date().toISOString()
    };
    
    setUser(userData);
    setUserRole(mockUser.role);
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify({ user: userData, role: mockUser.role }));
    
    return { error: null };
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
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
