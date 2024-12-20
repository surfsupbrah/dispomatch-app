import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FacilityCard } from '../components/FacilityCard';
import { useAuth } from '../context/AuthContext';
import type { Facility, BedAvailability } from '../types';

export function FacilityDashboard() {
  const { auth, updateFacility } = useAuth();

  const handleBedAvailabilityChange = (facilityId: string, availability: BedAvailability) => {
    const facility = auth.facilities.find(f => f.id === facilityId);
    if (facility) {
      updateFacility({ ...facility, bedAvailability: availability });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Facilities</h1>
        <Link
          to="/facility/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Facility
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auth.facilities.map((facility) => (
          <FacilityCard
            key={facility.id}
            facility={facility}
            onBedAvailabilityChange={handleBedAvailabilityChange}
          />
        ))}
      </div>

      {auth.facilities.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities yet</h3>
          <p className="text-gray-500">Get started by adding your first facility.</p>
        </div>
      )}
    </div>
  );
}