import type { Facility, SearchFilters, SearchResult } from '../types';

export function calculateMatchPercentage(facility: Facility, filters: SearchFilters): number {
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

  if (filters.availableBeds !== 'any') {
    totalWeight += 33.33;
    if (
      (filters.availableBeds === 'yes' && facility.bedAvailability === 'yes') ||
      (filters.availableBeds === 'no' && facility.bedAvailability === 'no')
    ) {
      matchedWeight += 33.33;
    }
  }

  return totalWeight === 0 ? 100 : Math.round((matchedWeight / totalWeight) * 100);
}

export function filterAndSortFacilities(
  facilities: Facility[],
  filters: SearchFilters,
  sortBy: 'match' | 'bedAvailability' = 'match'
): SearchResult[] {
  const results = facilities
    .map(facility => ({
      ...facility,
      matchPercentage: calculateMatchPercentage(facility, filters)
    }))
    .filter(facility => facility.matchPercentage > 0);

  return results.sort((a, b) => {
    switch (sortBy) {
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