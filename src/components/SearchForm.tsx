import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MultiSelect } from './MultiSelect';
import { LocationSearch } from './LocationSearch';
import type { SearchFilters, Insurance, Service, FacilityType } from '../types';

interface SearchFormProps {
  initialFilters?: SearchFilters;
}

const facilityTypes: FacilityType[] = [
  'Skilled Nursing Facility',
  'Short Term Rehab',
  'Assisted Living Facility',
  'Inpatient Rehabilitation Unit',
  'Home Services Provider',
  'Long Term Acute Care Hospital (LTACH)'
];

const insurances: Insurance[] = [
  'Medicaid',
  'Medicare',
  'Blue Cross & Blue Shield',
  'Neighborhood Health',
  'UnitedHealthcare',
  'Tufts Health Plan',
  'Aetna',
  'Harvard Pilgrim',
  'Cigna',
  'AmeriHealth Caritas',
  'Molina',
  'Oscar',
  'Other'
];

const services: Service[] = [
  'OT',
  'PT',
  'Speech Therapy',
  'Wound Care',
  'Medication Administration',
  'IV Medication Administration',
  'Social Services',
  'Nutrition Services',
  'Palliative & Hospice Care',
  'Behavioral Health',
  'Mobility Assistance',
  'ADL Assistance',
  '24-hour Nursing',
  'Memory Care',
  'Oxygen Therapy',
  'Transportation Services & Facility Transfers',
  'Interpreter Services',
  'Case Management'
];

export function SearchForm({ initialFilters }: SearchFormProps) {
  const navigate = useNavigate();
  const defaultFilters: SearchFilters = {
    facilityTypes: [],
    insurances: [],
    services: [],
    availableBeds: 'any',
    location: {
      address: '',
      radius: 25,
      useCurrentLocation: false,
      loading: false
    }
  };
  
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || defaultFilters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/search', { state: filters });
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-6">
        <MultiSelect
          options={facilityTypes}
          selected={filters.facilityTypes}
          onChange={(selected) => setFilters({ ...filters, facilityTypes: selected as FacilityType[] })}
          label="Facility Types"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MultiSelect
          options={insurances}
          selected={filters.insurances}
          onChange={(selected) => setFilters({ ...filters, insurances: selected as Insurance[] })}
          label="Insurances Accepted"
        />

        <MultiSelect
          options={services}
          selected={filters.services}
          onChange={(selected) => setFilters({ ...filters, services: selected as Service[] })}
          label="Services Required"
        />
      </div>
      
      <LocationSearch
        value={filters.location}
        onChange={(location) => setFilters({ ...filters, location })}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Bed Availability
        </label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="yes"
              checked={filters.availableBeds === 'yes'}
              onChange={(e) => setFilters({ ...filters, availableBeds: 'yes' })}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Available</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="no"
              checked={filters.availableBeds === 'no'}
              onChange={(e) => setFilters({ ...filters, availableBeds: 'no' })}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Not Available</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="any"
              checked={filters.availableBeds === 'any'}
              onChange={(e) => setFilters({ ...filters, availableBeds: 'any' })}
              className="form-radio text-indigo-600"
            />
            <span className="ml-2">Any</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Search className="h-5 w-5" />
        <span>Search Facilities</span>
      </button>
    </form>
  );
}