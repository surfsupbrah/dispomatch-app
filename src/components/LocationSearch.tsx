import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { getCoordinatesFromSearch } from '../utils/geocoding';
import type { Coordinates } from '../types';

interface LocationSearchProps {
  onLocationSelect: (location: string, coordinates: Coordinates, radius?: number) => void;
  initialLocation?: string;
}

interface Suggestion {
  name: string;
  state: string;
  city: string;
  street: string;
  postcode: string;
}

export function LocationSearch({ onLocationSelect, initialLocation = '' }: LocationSearchProps) {
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(25);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<number>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DispoMatch Healthcare Facility Finder'
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();
      const formattedSuggestions = data.features.map((feature: any) => ({
        name: feature.properties.name,
        state: feature.properties.state,
        city: feature.properties.city,
        street: feature.properties.street,
        postcode: feature.properties.postcode
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    }
  };

  const handleLocationSearch = async (searchText: string) => {
    setLocation(searchText);
    setError(null);

    if (searchTimeout.current) {
      window.clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = window.setTimeout(async () => {
      if (searchText.trim().length >= 3) {
        await fetchSuggestions(searchText);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSuggestionSelect = async (suggestion: Suggestion) => {
    const fullAddress = [
      suggestion.street,
      suggestion.city,
      suggestion.state,
      suggestion.postcode
    ].filter(Boolean).join(', ');

    setLocation(fullAddress);
    setShowSuggestions(false);
    setLoading(true);

    try {
      const coordinates = await getCoordinatesFromSearch(fullAddress);
      if (coordinates) {
        onLocationSelect(fullAddress, coordinates, radius);
        setError(null);
      } else {
        setError('Location not found. Please enter a more specific address.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location search failed');
    } finally {
      setLoading(false);
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
          onFocus={() => location.trim().length >= 3 && setShowSuggestions(true)}
          placeholder="Enter address, city, or ZIP code..."
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          >
            {suggestions.map((suggestion, index) => {
              const address = [
                suggestion.street,
                suggestion.city,
                suggestion.state,
                suggestion.postcode
              ].filter(Boolean).join(', ');

              return (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                  onClick={() => handleSuggestionSelect(suggestion)}
                >
                  <p className="text-sm text-gray-900">{address}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      <select
        value={radius}
        onChange={(e) => {
          const newRadius = Number(e.target.value);
          setRadius(newRadius);
          if (location.trim()) {
            getCoordinatesFromSearch(location).then(coordinates => {
              if (coordinates) {
                onLocationSelect(location, coordinates, newRadius);
              }
            });
          }
        }}
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