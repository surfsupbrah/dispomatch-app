import React from 'react';
import { Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from './LogoutButton';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const location = useLocation();
  const { auth } = useAuth();
  const isDashboard = location.pathname === '/dashboard';
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-500"
        >
          <Building2 className="h-8 w-8" />
          <span className="text-xl font-bold">DispoMatch</span>
        </Link>
        <div className="flex items-center space-x-4">
          {(isHomePage || (!isDashboard && !auth.isAuthenticated)) && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Manage Facilities
            </Link>
          )}
          {auth.isAuthenticated ? (
            <LogoutButton />
          ) : (
            !location.pathname.includes('login') && !location.pathname.includes('signup') && (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}