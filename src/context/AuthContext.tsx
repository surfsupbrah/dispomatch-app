import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, Facility } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateFacility: (facility: Facility) => void;
  addFacility: (facility: Facility) => void;
  deleteFacility: (facilityId: string) => void;
}

const STORAGE_KEY = 'dispomatch_auth';

const loadStoredAuth = (): AuthState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing stored auth:', error);
    }
  }
  return {
    isAuthenticated: false,
    facilities: [],
  };
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(loadStoredAuth);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = async (email: string, password: string) => {
    if (email && password) {
      const storedAuth = loadStoredAuth();
      setAuth({
        isAuthenticated: true,
        facilities: storedAuth.facilities || [],
      });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      facilities: auth.facilities,
    });
  };

  const updateFacility = (updatedFacility: Facility) => {
    const updatedFacilities = auth.facilities.map(facility => 
      facility.id === updatedFacility.id ? updatedFacility : facility
    );
    
    setAuth(prev => ({
      ...prev,
      facilities: updatedFacilities,
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...auth,
      facilities: updatedFacilities,
    }));
  };

  const addFacility = (newFacility: Facility) => {
    const updatedFacilities = [...auth.facilities, newFacility];
    
    setAuth(prev => ({
      ...prev,
      facilities: updatedFacilities,
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...auth,
      facilities: updatedFacilities,
    }));
  };

  const deleteFacility = (facilityId: string) => {
    const updatedFacilities = auth.facilities.filter(facility => facility.id !== facilityId);
    
    setAuth(prev => ({
      ...prev,
      facilities: updatedFacilities,
    }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...auth,
      facilities: updatedFacilities,
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