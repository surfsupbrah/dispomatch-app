import type { Facility } from '../types';

export interface AuthContextState {
  isAuthenticated: boolean;
  facilities: Facility[];
}

export interface AuthContextType {
  auth: AuthContextState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateFacility: (facility: Facility) => Promise<void>;
  addFacility: (facility: Facility) => Promise<void>;
  deleteFacility: (facilityId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}