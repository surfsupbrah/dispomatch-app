import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'match' | 'bedAvailability' | 'distance';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (option: SortOption) => void;
  showDistance?: boolean;
}

export function SortControls({ sortBy, onChange, showDistance }: SortControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: SortOption) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <span>Sort by: </span>
        <span className="ml-1 font-medium">
          {sortBy === 'match' && '% Match'}
          {sortBy === 'bedAvailability' && 'Bed Availability'}
          {sortBy === 'distance' && 'Distance'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleOptionSelect('match')}
              className={`w-full text-left px-4 py-2 text-sm ${
                sortBy === 'match'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              % Match
            </button>
            <button
              onClick={() => handleOptionSelect('bedAvailability')}
              className={`w-full text-left px-4 py-2 text-sm ${
                sortBy === 'bedAvailability'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Bed Availability
            </button>
            {showDistance && (
              <button
                onClick={() => handleOptionSelect('distance')}
                className={`w-full text-left px-4 py-2 text-sm ${
                  sortBy === 'distance'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                Distance
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}