import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import type { Coordinates } from '../types';

interface LocationSearchProps {
  onLocationSelect: (location: string, coordinates: Coordinates, radius?: number) => void;
  initialLocation?: string;
}

export function LocationSearch({ onLocationSelect, initialLocation = '' }: LocationSearchProps) {
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(25);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry']
    });

    autocompleteRef.current = autocomplete;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (place?.geometry?.location) {
        const coordinates = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        
        setLocation(place.formatted_address || '');
        onLocationSelect(place.formatted_address || '', coordinates, radius);
      }
    });

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [radius, onLocationSelect]);

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
          placeholder="Enter address..."
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
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