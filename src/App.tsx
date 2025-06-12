
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogManagement from "./pages/admin/BlogManagement";
import PublicationManagement from "./pages/admin/PublicationManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import WaitingListManagement from "./pages/admin/WaitingListManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";
import PatientManagement from "./pages/admin/PatientManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import PatientDashboard from "./pages/patient/Dashboard";

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {!isAdminRoute && <Header />}
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
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/appointments" element={<AppointmentManagement />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          <Route path="/admin/publications" element={<PublicationManagement />} />
          <Route path="/admin/admins" element={<AdminManagement />} />
          <Route path="/admin/waiting-list" element={<WaitingListManagement />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
