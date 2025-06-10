
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || (userRole !== 'admin' && userRole !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <div className="flex flex-1">
          <AdminSidebar />
          <SidebarInset className="flex-1">
            <div className="flex items-center gap-2 p-4 border-b">
              <SidebarTrigger />
              <div className="h-4 w-px bg-gray-300" />
              <h1 className="font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex-1 p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
        <footer className="border-t bg-white px-4 py-2">
          <div className="text-center text-sm text-gray-600">
            Admin Panel - Dr. Funmilola Wuraola Ajayi Medical Practice © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};
