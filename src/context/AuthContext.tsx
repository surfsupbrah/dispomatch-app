import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getFacilities, createFacility, updateFacility as updateFacilityInDb, deleteFacility as deleteFacilityInDb } from '../services/facilities';
import type { AuthState, Facility } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

  useEffect(() => {
    async function loadFacilities() {
      if (auth.isAuthenticated) {
        try {
          const facilities = await getFacilities();
          setAuth(prev => ({ ...prev, facilities }));
        } catch (err) {
          console.error('Error loading facilities:', err);
          setError('Failed to load facilities');
        }
      }
    }

    loadFacilities();
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: !!session,
      }));
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to create account');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
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
      console.error('Logout error:', err);
      setError('Failed to log out');
      throw err;
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
      console.error('Add facility error:', err);
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
      console.error('Update facility error:', err);
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
      console.error('Delete facility error:', err);
      setError('Failed to delete facility');
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        auth, 
        login,
        signup,
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