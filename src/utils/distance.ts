import distance from '@turf/distance';
import { point } from '@turf/helpers';
import type { Coordinates } from '../types';

export function calculateDistance(from?: Coordinates, to?: Coordinates): number {
  if (!from || !to) return 0;
  
  // Create points in [longitude, latitude] format as required by turf
  const fromPoint = point([from.lng, from.lat]);
  const toPoint = point([to.lng, to.lat]);
  
  try {
    return distance(fromPoint, toPoint, { units: 'miles' });
  } catch (error) {
    console.error('Error calculating distance:', error);
    return 0;
  }
}