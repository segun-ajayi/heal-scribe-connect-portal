
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
import PatientDashboard from "./pages/patient/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import Unauthorized from "@/pages/Unauthorized.tsx";
import ContentManagement from "./pages/admin/ContentManagement";
import PatientManagement from "@/pages/admin/PatientManagement.tsx";
import { EditModeProvider } from './contexts/EditModeContext';
import { EditModeToggle} from "@/components/ui/EditModeToggle.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/patients"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <PatientManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/blog"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <BlogManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/publications"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <PublicationManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/admins"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/waiting-list"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <WaitingListManagement />
                </ProtectedRoute>
              }
          />
          <Route
              path="/admin/content"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <ContentManagement />
                </ProtectedRoute>
              }
          />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      <EditModeToggle />

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
              <EditModeProvider>
                  <AppContent />
              </EditModeProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
