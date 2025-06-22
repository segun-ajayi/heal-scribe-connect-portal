
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Calendar, LogOut, Settings, User} from "lucide-react";

import { useEditMode } from '@/contexts/EditModeContext';
import { Pencil } from 'lucide-react';


interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, userRole, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const EditToggle = () => {
    const { isEditMode, toggleEditMode } = useEditMode();

    return (
        <button
            onClick={toggleEditMode}
            className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 z-50"
        >
          <Pencil className="inline-block w-4 h-4 mr-2" />
          {isEditMode ? 'Exit Edit Mode' : 'Edit Page'}
        </button>
    );
  };

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
              <div className="flex items-center space-x-4 ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">{user.fullName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link to={'/admin/dashboard'} className="flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
            </div>
            <div className="flex-1 p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
        <footer className="border-t bg-white px-4 py-2">
          <div className="text-center text-sm text-gray-600">
            Admin Panel - Dr. Funmilola Wuraola's Medical Practice © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};
