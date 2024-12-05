import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
}

async function searchNominatim(query: string): Promise<Coordinates | undefined> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=us`,
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
    
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    return undefined;
  } catch (error) {
    console.error('Geocoding error:', error);
    return undefined;
  }
}

export async function getCoordinatesFromSearch(searchString: string): Promise<Coordinates | undefined> {
  if (!searchString) return undefined;
  
  return searchNominatim(searchString);
}