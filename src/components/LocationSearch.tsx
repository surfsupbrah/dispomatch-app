import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { getCoordinatesFromSearch } from '../utils/geocoding';
import type { Coordinates } from '../types';

interface LocationSearchProps {
  onLocationSelect: (location: string, coordinates: Coordinates, radius?: number) => void;
  initialLocation?: string;
}

export function LocationSearch({ onLocationSelect, initialLocation = '' }: LocationSearchProps) {
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(25);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleLocationSearch = async (searchText: string) => {
    setLocation(searchText);
    setError(null);

    if (!searchText.trim()) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const coordinates = await getCoordinatesFromSearch(searchText);
        if (coordinates) {
          onLocationSelect(searchText, coordinates, radius);
        } else {
          setError('Location not found. Please try a different search.');
        }
      } catch (err) {
        setError('Error searching location. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (location.trim()) {
      handleLocationSearch(location);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Search by Location
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={location}
          onChange={(e) => handleLocationSearch(e.target.value)}
          placeholder="Enter address, city, or ZIP code..."
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <select
        value={radius}
        className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        onChange={(e) => handleRadiusChange(Number(e.target.value))}
      >
        <option value="5">Within 5 miles</option>
        <option value="10">Within 10 miles</option>
        <option value="25">Within 25 miles</option>
        <option value="50">Within 50 miles</option>
      </select>
    </div>
  );
}