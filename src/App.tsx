import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import About from "./pages/About";
import Publications from "./pages/Publications";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Appointments from "./pages/Appointments";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AppointmentManagement from "./pages/AppointmentManagement";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import PublicationManagement from "./pages/admin/PublicationManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import WaitingListManagement from "./pages/admin/WaitingListManagement";
import PatientDashboard from "./pages/patient/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ✅ Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
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

const App: React.FC = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen bg-slate-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/publications" element={<Publications />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* ✅ Admin Routes (Protected) */}
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/appointments" element={<ProtectedRoute><AppointmentManagement /></ProtectedRoute>} />
                    <Route path="/admin/blog" element={<ProtectedRoute><BlogManagement /></ProtectedRoute>} />
                    <Route path="/admin/publications" element={<ProtectedRoute><PublicationManagement /></ProtectedRoute>} />
                    <Route path="/admin/admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
                    <Route path="/admin/waiting-list" element={<ProtectedRoute><WaitingListManagement /></ProtectedRoute>} />

                    {/* ✅ Patient Routes (Protected) */}
                    <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
  );
};

export default App;