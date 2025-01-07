import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
    // Make the query more flexible by not requiring exact state match
    const encodedQuery = encodeURIComponent(`${query}, RI, USA`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=us&state=rhode%20island`,
      {
        headers: {
          'User-Agent': 'DispoMatch Healthcare Facility Finder'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json() as NominatimResponse[];
    
    if (data.length === 0) {
      console.log('No results found for query:', query);
      return undefined;
    }

    const coords = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

    // Validate the coordinates are within Rhode Island bounds
    if (coords.lat >= 41.1 && coords.lat <= 42.1 && 
        coords.lng >= -71.9 && coords.lng <= -71.1) {
      return coords;
    }

    return undefined;
  } catch (error) {
    console.error('Geocoding error:', error);
    return undefined;
  }
}