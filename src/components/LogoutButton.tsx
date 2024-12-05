import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setStoredAuth } from '../utils/auth';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    setStoredAuth(false);
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </button>
  );
}