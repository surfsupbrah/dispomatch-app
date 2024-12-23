import React from 'react';
import { Building2, Edit, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Facility, BedAvailability } from '../types';

interface FacilityCardProps {
  facility: Facility;
  onBedAvailabilityChange: (id: string, availability: BedAvailability) => void;
}

export function FacilityCard({ facility, onBedAvailabilityChange }: FacilityCardProps) {
  const getBedAvailabilityColor = (availability: BedAvailability) => {
    switch (availability) {
      case 'yes':
        return 'bg-green-100 text-green-800';
      case 'no':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-indigo-600" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
            <p className="text-sm text-gray-500">{facility.location}</p>
          </div>
        </div>
        <Link
          to={`/facility/${facility.id}`}
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          <span>{facility.phone}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bed Availability
          </label>
          <select
            value={facility.bedAvailability}
            onChange={(e) => onBedAvailabilityChange(facility.id, e.target.value as BedAvailability)}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${getBedAvailabilityColor(
              facility.bedAvailability
            )}`}
          >
            <option value="yes">Available</option>
            <option value="no">Not Available</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  );
}