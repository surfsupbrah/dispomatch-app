import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchForm } from '../components/SearchForm';
import type { SearchFilters } from '../types';

export function HomePage() {
  const location = useLocation();
  const savedFilters = location.state as SearchFilters | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect Post-Acute Care Facility
          </h1>
          <p className="text-xl text-gray-600">
            Helping case managers connect patients with the right care facilities
          </p>
        </div>
        <SearchForm initialFilters={savedFilters} />
      </div>
    </div>
  );
}