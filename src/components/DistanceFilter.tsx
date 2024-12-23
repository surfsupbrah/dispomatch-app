import React from 'react';

interface DistanceFilterProps {
  value: number;
  onChange: (value: number) => void;
}

export function DistanceFilter({ value, onChange }: DistanceFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="maxDistance" className="text-sm font-medium text-gray-700">
        Within
      </label>
      <select
        id="maxDistance"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value={5}>5 miles</option>
        <option value={10}>10 miles</option>
        <option value={25}>25 miles</option>
        <option value={50}>50 miles</option>
        <option value={9999}>Any distance</option>
      </select>
    </div>
  );
}