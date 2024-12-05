import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEY } from '../../constants/auth';
import type { AuthState } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateFacility: (facility: Facility) => void;
  addFacility: (facility: Facility) => void;
  deleteFacility: (facilityId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useLocalStorage<AuthState>(STORAGE_KEY, {
    isAuthenticated: false,
    facilities: [],
  });

  const login = async (email: string, password: string) => {
    if (email && password) {
      setAuth(prev => ({
        isAuthenticated: true,
        facilities: prev.facilities,
      }));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAuth(prev => ({
      isAuthenticated: false,
      facilities: prev.facilities,
    }));
  };

  const updateFacility = (updatedFacility: Facility) => {
    setAuth(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility => 
        facility.id === updatedFacility.id ? updatedFacility : facility
      ),
    }));
  };

  const addFacility = (newFacility: Facility) => {
    setAuth(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));
  };

  const deleteFacility = (facilityId: string) => {
    setAuth(prev => ({
      ...prev,
      facilities: prev.facilities.filter(facility => facility.id !== facilityId),
    }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateFacility, addFacility, deleteFacility }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}