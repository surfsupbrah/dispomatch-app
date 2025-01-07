import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, hasValidCredentials } from '../lib/supabase';
import { getFacilities, createFacility, updateFacility as updateFacilityInDb, deleteFacility as deleteFacilityInDb } from '../services/facilities';
import type { AuthState, Facility } from '../types';

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateFacility: (facility: Facility) => Promise<void>;
  addFacility: (facility: Facility) => Promise<void>;
  deleteFacility: (facilityId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    facilities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasValidCredentials()) {
      setError('Please connect to Supabase using the "Connect to Supabase" button');
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuth(prev => ({
        ...prev,
        isAuthenticated: !!session,
      }));
      setLoading(false);

      if (event === 'SIGNED_IN') {
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Invalid email or password');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setAuth({
        isAuthenticated: false,
        facilities: [],
      });
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log out');
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
      setError(err instanceof Error ? err.message : 'Failed to add facility');
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
      setError(err instanceof Error ? err.message : 'Failed to update facility');
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
      setError(err instanceof Error ? err.message : 'Failed to delete facility');
      throw err;
    }
  };

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
        error,
        clearError
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
