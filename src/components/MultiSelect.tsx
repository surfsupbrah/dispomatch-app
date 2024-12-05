import React from 'react';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
}

export function MultiSelect({ options, selected, onChange, label }: MultiSelectProps) {
  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const handleSelectAll = () => {
    if (selected.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const isAllSelected = selected.length === options.length;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="border border-gray-300 rounded-md p-2 max-h-48 overflow-y-auto">
        <div className="border-b border-gray-200 pb-2 mb-2">
          <div className="flex items-center space-x-2 p-1">
            <input
              type="checkbox"
              id={`select-all-${label}`}
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`select-all-${label}`} className="text-sm font-medium text-gray-700">
              Select All
            </label>
          </div>
        </div>
        {options.map(option => (
          <div key={option} className="flex items-center space-x-2 p-1">
            <input
              type="checkbox"
              id={option}
              checked={selected.includes(option)}
              onChange={() => toggleOption(option)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={option} className="text-sm text-gray-700">
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}