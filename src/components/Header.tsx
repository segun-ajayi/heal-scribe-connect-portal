
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { User, LogOut, Settings, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { user, userRole, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'admin' || userRole === 'super_admin') {
      return '/admin/dashboard';
    }
    return '/patient/dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dr. Ajayi</h1>
                <p className="text-xs text-gray-600">Medical Practice</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/publications" className="text-gray-600 hover:text-gray-900">
              Publications
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link to="/appointments" className="text-gray-600 hover:text-gray-900">
              Appointments
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userRole === 'patient' && (
                    <DropdownMenuItem asChild>
                      <Link to="/appointments" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        My Appointments
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};
