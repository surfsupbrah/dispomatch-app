import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
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
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry'],
      types: ['address']
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place?.geometry?.location) {
        setError('Please select a valid address from the dropdown');
        return;
      }

      const coordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setLocation(place.formatted_address || '');
      onLocationSelect(place.formatted_address || '', coordinates, radius);
      setError(null);
    });

    return () => {
      if (google.maps.event && autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationSelect, radius]);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (location && autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        onLocationSelect(place.formatted_address || '', coordinates, newRadius);
      }
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
          ref={inputRef}
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <select
        value={radius}
        onChange={(e) => handleRadiusChange(Number(e.target.value))}
        className="mt-2 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white shadow-sm"
      >
        <option value="5">Within 5 miles</option>
        <option value="10">Within 10 miles</option>
        <option value="25">Within 25 miles</option>
        <option value="50">Within 50 miles</option>
        <option value="100">Within 100 miles</option>
      </select>
    </div>
  );
}