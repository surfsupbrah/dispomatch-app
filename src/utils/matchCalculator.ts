import { calculateDistance } from './distance';
import type { Facility, SearchFilters } from '../types';

export function calculateMatchPercentage(facility: Facility, filters: SearchFilters): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  // Facility Type Match (33.33%)
  if (filters.facilityTypes.length > 0) {
    totalWeight += 33.33;
    if (filters.facilityTypes.some(type => facility.type.includes(type))) {
      matchedWeight += 33.33;
    }
  }

  // Insurance Match (33.33%)
  if (filters.insurances.length > 0) {
    totalWeight += 33.33;
    const matchedInsurances = filters.insurances.filter(insurance => 
      facility.insurances.includes(insurance)
    ).length;
    matchedWeight += (33.33 * matchedInsurances / filters.insurances.length);
  }

  // Services Match (33.33%)
  if (filters.services.length > 0) {
    totalWeight += 33.33;
    const matchedServices = filters.services.filter(service => 
      facility.services.includes(service)
    ).length;
    matchedWeight += (33.33 * matchedServices / filters.services.length);
  }

  // Bed Availability (additional weight if specified)
  if (filters.availableBeds !== 'any') {
    totalWeight += 33.33;
    if (
      (filters.availableBeds === 'yes' && facility.bedAvailability === 'yes') ||
      (filters.availableBeds === 'no' && facility.bedAvailability === 'no')
    ) {
      matchedWeight += 33.33;
    }
  }

  // Facility Name Match
  if (filters.facilityName) {
    totalWeight += 33.33;
    if (facility.name.toLowerCase().includes(filters.facilityName.toLowerCase())) {
      matchedWeight += 33.33;
    }
  }

  return totalWeight === 0 ? 100 : Math.round((matchedWeight / totalWeight) * 100);
}

export function filterAndSortFacilities(
  facilities: Facility[],
  filters: SearchFilters,
  sortBy: 'match' | 'bedAvailability' | 'distance' = 'match'
): (Facility & { matchPercentage: number })[] {
  const results = facilities
    .filter(facility => {
      const matchPercentage = calculateMatchPercentage(facility, filters);
      if (matchPercentage === 0) return false;
      
      if (filters.coordinates && facility.coordinates && filters.radius) {
        const distance = calculateDistance(filters.coordinates, facility.coordinates);
        return distance <= filters.radius;
      }
      
      return true;
    })
    .map(facility => ({
      ...facility,
      matchPercentage: calculateMatchPercentage(facility, filters)
    }));

  return results.sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return b.matchPercentage - a.matchPercentage;
      case 'bedAvailability':
        const bedOrder = { yes: 0, unknown: 1, no: 2 };
        return bedOrder[a.bedAvailability] - bedOrder[b.bedAvailability];
      case 'distance':
        if (!a.distance || !b.distance) return 0;
        return a.distance - b.distance;
      default:
        return 0;
    }
  });
}
