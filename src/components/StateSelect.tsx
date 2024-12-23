import React from 'react';
import { STATES } from '../constants/states';

interface StateSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function StateSelect({ id, value, onChange, className = '' }: StateSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
      required
    >
      <option value="">Select State</option>
      {STATES.map(state => (
        <option key={state.code} value={state.code}>
          {state.name}
        </option>
      ))}
    </select>
  );
}