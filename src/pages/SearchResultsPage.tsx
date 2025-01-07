import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Building2, Phone, Mail, User, Printer, Loader } from 'lucide-react';
import { SortControls, type SortOption } from '../components/SortControls';
import { searchFacilities } from '../services/facilities';
import { filterAndSortFacilities } from '../utils/matchCalculator';
import { formatLastUpdated } from '../utils/dateFormatter';
import { getCoordinatesFromSearch } from '../utils/geocoding';
import { calculateDistance } from '../utils/distance';
import type { SearchFilters, Facility } from '../types';

const RESULTS_PER_PAGE = 10;

export function SearchResultsPage() {
  const location = useLocation();
  const filters = location.state as SearchFilters;
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(RESULTS_PER_PAGE);

  useEffect(() => {
    async function loadFacilities() {
      if (!filters) {
        setError('No search filters provided');
        setLoading(false);
        return;
      }

      try {
        const data = await searchFacilities();
        
        if (filters.location && filters.location.trim() !== '') {
          const searchCoords = await getCoordinatesFromSearch(filters.location);
          if (searchCoords) {
            filters.coordinates = searchCoords;
            
            const facilitiesWithCoords = await Promise.all(
              data.map(async (facility) => {
                const coords = await getCoordinatesFromSearch(facility.location);
                return {
                  ...facility,
                  coordinates: coords,
                  distance: coords ? calculateDistance(searchCoords, coords) : undefined
                };
              })
            );
            
            setFacilities(facilitiesWithCoords);
          } else {
            setFacilities(data);
          }
        } else {
          setFacilities(data);
        }
      } catch (err) {
        console.error('Error loading facilities:', err);
        setError('Failed to load facilities. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadFacilities();
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const results = filterAndSortFacilities(facilities, filters, sortBy);
  const displayedResults = results.slice(0, displayCount);
  const hasMore = displayCount < results.length;

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + RESULTS_PER_PAGE);
      setLoadingMore(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          <p className="text-gray-600">
            Found {results.length} matching facilities
            {results.length > 0 && ` (Showing ${Math.min(displayCount, results.length)})`}
          </p>
        </div>
        <SortControls 
          sortBy={sortBy} 
          onChange={setSortBy}
          showDistance={!!filters.coordinates} 
        />
      </div>

      <div className="space-y-6">
        {displayedResults.map((facility) => (
          <div 
            key={facility.id} 
            className="facility-card bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              <div className="w-full md:w-1/4 mb-4 md:mb-0">
                <img
                  src={facility.imageUrl}
                  alt={facility.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{facility.name}</h2>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span>{facility.location}</span>
                      {facility.distance !== undefined && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({facility.distance.toFixed(1)} miles away)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`px-3 py-1 rounded-full text-sm font-medium cursor-help
                        ${facility.bedAvailability === 'yes' ? 'bg-green-100 text-green-800' :
                          facility.bedAvailability === 'no' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}
                      title={formatLastUpdated(facility.updatedAt)}
                    >
                      {facility.bedAvailability === 'yes' ? 'Beds Available' :
                       facility.bedAvailability === 'no' ? 'No Beds' : 'Unknown Availability'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium
                      ${facility.matchPercentage >= 80 ? 'bg-green-100 text-green-800' :
                        facility.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'}`}>
                      {facility.matchPercentage}% Match
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      {facility.contact.name && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{facility.contact.name}</span>
                          {facility.contact.phoneExt && (
                            <span className="ml-2 text-gray-500">
                              (ext. {facility.contact.phoneExt})
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{facility.phone}</span>
                      </div>
                      {facility.fax && (
                        <div className="flex items-center">
                          <Printer className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{facility.fax}</span>
                        </div>
                      )}
                      {facility.contact.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{facility.contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Facility Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.type.map(type => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Insurances Accepted</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.insurances.map(insurance => (
                        <span
                          key={insurance}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                        >
                          {insurance}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {facility.services.map(service => (
                        <span
                          key={service}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matching facilities found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Search
            </Link>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loadingMore ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Loading more...
                </>
              ) : (
                'Show 10 More'
              )}
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          state={filters}
          className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Search
        </Link>
      </div>
    </div>
  );
}
