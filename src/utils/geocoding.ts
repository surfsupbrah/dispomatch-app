import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

const RATE_LIMIT_DELAY = 1500; // 1.5 seconds between requests
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
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DispoMatch Healthcare Facility Finder'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Location service error');
    }

    const data = await response.json() as NominatimResponse[];
    
    if (data.length === 0) {
      throw new Error('Location not found');
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Location not found') {
      throw new Error('Location not found. Please try a more specific address.');
    }
    throw new Error('Unable to search location. Please try again.');
  }
}