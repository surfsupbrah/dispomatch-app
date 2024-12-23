import React, { useState, useCallback } from 'react';
import { MapPin, Loader, Navigation } from 'lucide-react';
import type { LocationSearchState } from '../types';
import { getCoordinatesFromSearch } from '../utils/geocoding';

const RADIUS_OPTIONS = [
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
  { value: 25, label: '25 miles' },
  { value: 50, label: '50 miles' },
];

interface LocationSearchProps {
  value: LocationSearchState;
  onChange: (location: LocationSearchState) => void;
}

export function LocationSearch({ value, onChange }: LocationSearchProps) {
  const [addressInput, setAddressInput] = useState(value?.address || '');
  
  const handleAddressSearch = useCallback(async () => {
    if (!addressInput.trim()) {
      onChange({
        ...(value || {}),
        coordinates: undefined,
        address: '',
        error: 'Please enter an address',
      });
      return;
    }

    onChange({ ...(value || {}), loading: true, error: undefined });
    
    try {
      const coordinates = await getCoordinatesFromSearch(addressInput);
      if (coordinates) {
        onChange({
          ...(value || {}),
          coordinates,
          address: addressInput,
          loading: false,
          error: undefined,
          useCurrentLocation: false,
        });
      } else {
        onChange({
          ...(value || {}),
          coordinates: undefined,
          loading: false,
          error: 'Address not found',
        });
      }
    } catch (error) {
      onChange({
          ...(value || {}),
        coordinates: undefined,
        loading: false,
        error: 'Failed to get location coordinates',
      });
    }
  }, [addressInput, onChange, value]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      onChange({
        ...(value || {}),
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    onChange({ ...(value || {}), loading: true, error: undefined });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          ...(value || {}),
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          loading: false,
          useCurrentLocation: true,
          error: undefined,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Please allow location access to use this feature';
        }
        onChange({
          ...(value || {}),
          coordinates: undefined,
          loading: false,
          error: errorMessage,
        });
      }
    );
  }, [onChange, value]);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Location Search
      </label>
      
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter address, city, or ZIP code"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {value.loading ? (
                  <Loader className="h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <MapPin className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleAddressSearch}
            disabled={value.loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Search
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={value.loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use My Location
          </button>

          <select
            value={value?.radius || 25}
            onChange={(e) => onChange({ ...(value || {}), radius: Number(e.target.value) })}
            className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {value?.error && (
          <p className="text-sm text-red-600">{value?.error}</p>
        )}

        {value?.coordinates && (
          <p className="text-sm text-green-600">
            Location found! Showing results within {value?.radius || 25} miles
          </p>
        )}
      </div>
    </div>
  );
}