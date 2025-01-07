import { calculateDistance } from './distance';
import type { Facility, SearchFilters } from '../types';

export function calculateMatchPercentage(facility: Facility, filters: SearchFilters): number {
  // If there's a name filter and it doesn't match, return 0
  if (filters.facilityName && !facility.name.toLowerCase().includes(filters.facilityName.toLowerCase())) {
    return 0;
  }

  // If location is specified and facility is outside radius, return 0
  if (filters.coordinates && facility.coordinates) {
    const distance = calculateDistance(filters.coordinates, facility.coordinates);
    if (filters.radius && distance > filters.radius) {
      return 0;
    }
  }

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

  return totalWeight === 0 ? 100 : Math.round((matchedWeight / totalWeight) * 100);
}
