import React from 'react';
import { Building2, Phone, MapPin } from 'lucide-react';
import type { SearchResult } from '../types';

interface SearchResultCardProps {
  result: SearchResult;
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const getBedAvailabilityColor = (availability: string) => {
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
      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        <div className="w-full md:w-1/4 mb-4 md:mb-0">
          <img
            src={result.imageUrl}
            alt={result.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{result.name}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{result.location}</span>
                {result.distance !== null && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({result.distance.toFixed(1)} miles away)
                  </span>
                )}
              </div>
              <div className="flex items-center text-gray-600 mt-1">
                <Phone className="h-4 w-4 mr-1" />
                <span>{result.phone}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div 
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${getBedAvailabilityColor(result.bedAvailability)}`}
              >
                {result.bedAvailability === 'yes' ? 'Beds Available' :
                 result.bedAvailability === 'no' ? 'No Beds' : 'Unknown Availability'}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium
                ${result.matchPercentage >= 80 ? 'bg-green-100 text-green-800' :
                  result.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'}`}>
                {result.matchPercentage}% Match
              </div>
            </div>
          </div>

          {/* Rest of the card content remains the same */}
        </div>
      </div>
    </div>
  );
}