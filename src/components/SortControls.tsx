import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'match' | 'bedAvailability' | 'distance';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (option: SortOption) => void;
  showDistance?: boolean;
}

export function SortControls({ sortBy, onChange, showDistance }: SortControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="ml-2 block bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700"
        >
          <option value="match">% Match</option>
          <option value="bedAvailability">Bed Availability</option>
          {showDistance && <option value="distance">Distance</option>}
        </select>
      </div>
    </div>
  );
}