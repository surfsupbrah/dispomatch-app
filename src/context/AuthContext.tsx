import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getFacilities, createFacility, updateFacility as updateFacilityInDb, deleteFacility as deleteFacilityInDb } from '../services/facilities';
import type { AuthState, Facility } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateFacility: (facility: Facility) => Promise<void>;
  addFacility: (facility: Facility) => Promise<void>;
  deleteFacility: (facilityId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    facilities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load facilities when authenticated
  useEffect(() => {
    async function loadFacilities() {
      if (auth.isAuthenticated) {
        try {
          const facilities = await getFacilities();
          setAuth(prev => ({ ...prev, facilities }));
        } catch (err) {
          setError('Failed to load facilities');
          console.error('Error loading facilities:', err);
        }
      }
    }

    loadFacilities();
  }, [auth.isAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuth(prev => ({
          ...prev,
          isAuthenticated: !!session,
        }));
      } catch (err) {
        console.error('Error checking session:', err);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: !!session,
      }));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError('Invalid email or password');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuth({
        isAuthenticated: false,
        facilities: [],
      });
    } catch (err) {
      setError('Failed to log out');
      console.error('Error logging out:', err);
    }
  };

  const addFacility = async (newFacility: Facility) => {
    setError(null);
    try {
      const facility = await createFacility(newFacility);
      setAuth(prev => ({
        ...prev,
        facilities: [...prev.facilities, facility],
      }));
    } catch (err) {
      setError('Failed to add facility');
      throw err;
    }
  };

  const updateFacility = async (facility: Facility) => {
    setError(null);
    try {
      const updatedFacility = await updateFacilityInDb(facility.id, facility);
      setAuth(prev => ({
        ...prev,
        facilities: prev.facilities.map(f => 
          f.id === facility.id ? updatedFacility : f
        ),
      }));
    } catch (err) {
      setError('Failed to update facility');
      throw err;
    }
  };

  const deleteFacility = async (facilityId: string) => {
    setError(null);
    try {
      await deleteFacilityInDb(facilityId);
      setAuth(prev => ({
        ...prev,
        facilities: prev.facilities.filter(f => f.id !== facilityId),
      }));
    } catch (err) {
      setError('Failed to delete facility');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{ 
        auth, 
        login, 
        logout, 
        updateFacility, 
        addFacility, 
        deleteFacility,
        loading,
        error
      }}
    >
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