import React, { useState } from 'react';
import { Filter } from 'lucide-react';

export type FilterOption = 'bedsAvailable' | 'within5Miles' | 'within10Miles' | 'recentlyUpdated';

interface FilterControlsProps {
  onFilterChange: (filters: FilterOption[]) => void;
  selectedFilters: FilterOption[];
}

export function FilterControls({ onFilterChange, selectedFilters }: FilterControlsProps) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleFilter = (filter: FilterOption) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter];
    onFilterChange(newFilters);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter Results
        {selectedFilters.length > 0 && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {selectedFilters.length}
          </span>
        )}
      </button>

      {showMenu && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu">
            <button
              onClick={() => toggleFilter('bedsAvailable')}
              className={`w-full text-left px-4 py-2 text-sm ${
                selectedFilters.includes('bedsAvailable')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Beds Available
            </button>
            <button
              onClick={() => toggleFilter('within5Miles')}
              className={`w-full text-left px-4 py-2 text-sm ${
                selectedFilters.includes('within5Miles')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Within 5 miles
            </button>
            <button
              onClick={() => toggleFilter('within10Miles')}
              className={`w-full text-left px-4 py-2 text-sm ${
                selectedFilters.includes('within10Miles')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Within 10 miles
            </button>
            <button
              onClick={() => toggleFilter('recentlyUpdated')}
              className={`w-full text-left px-4 py-2 text-sm ${
                selectedFilters.includes('recentlyUpdated')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              Updated In Last 24 Hours
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
