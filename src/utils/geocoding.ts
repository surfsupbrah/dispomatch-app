import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
    // Add state=RI to limit results to Rhode Island
    const encodedQuery = encodeURIComponent(`${query}, Rhode Island`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&state=RI`,
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
      return undefined;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return undefined;
  }
}