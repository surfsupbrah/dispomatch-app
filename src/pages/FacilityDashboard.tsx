import React, { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FacilityCard } from '../components/FacilityCard';
import { useAuth } from '../context/AuthContext';
import { updateFacilityCoordinates } from '../services/facilities';
import type { Facility, BedAvailability } from '../types';

export function FacilityDashboard() {
  const { auth, updateFacility } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleBedAvailabilityChange = (facilityId: string, availability: BedAvailability) => {
    const facility = auth.facilities.find(f => f.id === facilityId);
    if (facility) {
      updateFacility({ ...facility, bedAvailability: availability });
    }
  };

  const updateAllCoordinates = async () => {
    setUpdating(true);
    try {
      for (const facility of auth.facilities) {
        try {
          const coordinates = await updateFacilityCoordinates(facility);
          console.log(`Updated coordinates for ${facility.name}:`, coordinates);
        } catch (error) {
          console.error(`Failed to update coordinates for ${facility.name}:`, error);
        }
      }
      alert('Geolocation update completed.');
    } catch (error) {
      console.error('Error updating coordinates:', error);
      alert('Failed to update geolocations. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Manage Facilities</h1>
        <div className="flex gap-4">
          <button
            onClick={updateAllCoordinates}
            disabled={updating}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
          >
            <MapPin className="h-5 w-5 mr-2" />
            {updating ? 'Updating...' : 'Update Geolocation'}
          </button>
          <Link
            to="/facility/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Facility
          </Link>
        </div>
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