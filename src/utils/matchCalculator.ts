import type { Facility, SearchFilters } from '../types';
import { calculateDistance } from './distance';

export function calculateMatchPercentage(facility: Facility, filters: SearchFilters): number {
  let totalWeight = 0;
  let matchedWeight = 0;

  // Location Match (if applicable)
  if (filters.location?.coordinates && facility.coordinates) {
    const distance = calculateDistance(filters.location.coordinates, facility.coordinates);
    if (distance !== undefined && distance <= filters.location.radius) {
      // Add location weight only if within radius
      totalWeight += 33.33;
      // Calculate score based on distance (closer = better)
      const distanceScore = calculateDistanceScore(distance, filters.location.radius);
      matchedWeight += distanceScore * 33.33;
    }
  }

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

export function calculateDistanceScore(distance: number, maxRadius: number): number {
  // Convert distance to a 0-1 score (1 = closest, 0 = furthest)
  return Math.max(0, 1 - (distance / maxRadius));
}