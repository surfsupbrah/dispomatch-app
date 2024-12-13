import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useSession } from '../hooks/useSession';
import { getFacilities, createFacility, updateFacility as updateFacilityInDb, deleteFacility as deleteFacilityInDb } from '../services/facilities';
import type { AuthContextState, AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading: sessionLoading, isAuthenticated } = useSession();
  const [auth, setAuth] = useState<AuthContextState>({
    isAuthenticated: false,
    facilities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFacilities() {
      if (isAuthenticated) {
        try {
          const facilities = await getFacilities();
          setAuth(prev => ({ ...prev, facilities, isAuthenticated: true }));
        } catch (err) {
          console.error('Error loading facilities:', err);
          setError('Failed to load facilities');
        }
      } else {
        setAuth(prev => ({ ...prev, facilities: [], isAuthenticated: false }));
      }
      setLoading(false);
    }

    if (!sessionLoading) {
      loadFacilities();
    }
  }, [isAuthenticated, sessionLoading]);

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
        loading: loading || sessionLoading,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}