import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

const RATE_LIMIT_DELAY = 1000;
let lastRequestTime = 0;

async function waitForRateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
    await waitForRateLimit();
    
    const encodedQuery = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DispoMatch Healthcare Facility Finder (contact@dispomatch.com)'
      }
    });
    
    if (!response.ok) {
      console.error('Nominatim API error:', response.status, response.statusText);
      throw new Error('Location service temporarily unavailable');
    }

    const data = await response.json() as NominatimResponse[];
    
    if (!data || data.length === 0) {
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
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unable to process location search');
  }
}