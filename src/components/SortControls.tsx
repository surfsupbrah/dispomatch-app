import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'match' | 'bedAvailability' | 'distance';

interface SortControlsProps {
  sortBy: SortOption;
  onChange: (option: SortOption) => void;
}

export function SortControls({ sortBy, onChange }: SortControlsProps) {
  return (
    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
      <ArrowUpDown className="h-5 w-5 text-gray-400" />
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
      >
        <option value="distance">Distance</option>
        <option value="match">% Match</option>
        <option value="bedAvailability">Bed Availability</option>
      </select>
    </div>
  );
}