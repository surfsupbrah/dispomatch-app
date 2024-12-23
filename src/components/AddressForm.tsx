import React from 'react';
import { StateSelect } from './StateSelect';
import type { Address } from '../types';

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  className?: string;
}

export function AddressForm({ address, onChange, className = '' }: AddressFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          value={address.street}
          onChange={(e) => onChange({ ...address, street: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City/Town
          </label>
          <input
            type="text"
            id="city"
            value={address.city}
            onChange={(e) => onChange({ ...address, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <StateSelect
            id="state"
            value={address.state}
            onChange={(value) => onChange({ ...address, state: value })}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            id="zip"
            value={address.zip}
            onChange={(e) => onChange({ ...address, zip: e.target.value })}
            pattern="[0-9]{5}"
            maxLength={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
    </div>
  );
}