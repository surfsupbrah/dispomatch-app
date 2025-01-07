import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
    // Add proper delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'DispoMatch Healthcare Facility Finder (dispomatch@example.com)',
          'Accept-Language': 'en'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests. Please try again in a moment.');
      }
      throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json() as NominatimResponse[];
    
    if (data.length === 0) {
      return undefined;
    }

    const coordinates = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };

    // Validate coordinates
    if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
      throw new Error('Invalid coordinates received');
    }

    return coordinates;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}