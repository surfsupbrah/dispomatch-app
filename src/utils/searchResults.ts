import { calculateDistance } from './distance';
import type { Facility, SearchFilters, SearchResult, Coordinates } from '../types';

export function filterAndSortFacilities(
  facilities: Facility[],
  filters: SearchFilters,
  userCoordinates: Coordinates | null
): SearchResult[] {
  const results = facilities
    .map(facility => {
      const distance = userCoordinates && facility.coordinates
        ? calculateDistance(userCoordinates, facility.coordinates)
        : null;

      const matchPercentage = calculateMatchPercentage(facility, filters);

      return {
        ...facility,
        distance,
        matchPercentage
      };
    })
    .filter(facility => {
      // Filter by match percentage
      if (facility.matchPercentage === 0) return false;

      // Filter by distance if coordinates are available
      if (userCoordinates && facility.distance && filters.maxDistance) {
        return facility.distance <= filters.maxDistance;
      }

      return true;
    });

  return sortResults(results, filters.sortBy || 'distance');
}

function sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
  return [...results].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        if (!a.distance || !b.distance) return 0;
        return a.distance - b.distance;
      case 'match':
        return b.matchPercentage - a.matchPercentage;
      case 'bedAvailability':
        const bedOrder = { yes: 0, unknown: 1, no: 2 };
        return bedOrder[a.bedAvailability] - bedOrder[b.bedAvailability];
      default:
        return 0;
    }
  });
}

function calculateMatchPercentage(facility: Facility, filters: SearchFilters): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  if (filters.facilityTypes.length > 0) {
    totalWeight += 33.33;
    if (filters.facilityTypes.some(type => facility.type.includes(type))) {
      matchedWeight += 33.33;
    }
  }

  if (filters.insurances.length > 0) {
    totalWeight += 33.33;
    const matchedInsurances = filters.insurances.filter(insurance => 
      facility.insurances.includes(insurance)
    ).length;
    matchedWeight += (33.33 * matchedInsurances / filters.insurances.length);
  }

  if (filters.services.length > 0) {
    totalWeight += 33.33;
    const matchedServices = filters.services.filter(service => 
      facility.services.includes(service)
    ).length;
    matchedWeight += (33.33 * matchedServices / filters.services.length);
  }

  return totalWeight === 0 ? 100 : Math.round((matchedWeight / totalWeight) * 100);
}