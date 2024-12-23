import { useState, useCallback } from 'react';
import { getCoordinatesFromAddress } from '../utils/geocoding';
import type { Address, Coordinates } from '../types';

export function useLocationSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const searchLocation = useCallback(async (address: Address) => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCoordinatesFromAddress(address);
      if (!coords) {
        throw new Error('Address not found');
      }
      setCoordinates(coords);
      return coords;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchLocation, loading, error, coordinates };
}