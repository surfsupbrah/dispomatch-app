import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

const NOMINATIM_ENDPOINTS = [
  'https://nominatim.openstreetmap.org',
  'https://nominatim.geocoding.ai',  // Fallback server
];

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

async function tryFetch(url: string, options: RequestInit): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out');
      }
    }
    throw error;
  }
}

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  await waitForRateLimit();

  const encodedQuery = encodeURIComponent(query);
  
  for (const baseUrl of NOMINATIM_ENDPOINTS) {
    try {
      const url = `${baseUrl}/search?q=${encodedQuery}&format=json&limit=1`;
      
      const response = await tryFetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'DispoMatch Healthcare Facility Finder'
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        continue; // Try next endpoint
      }

      const data = await response.json() as NominatimResponse[];
      
      if (!data || data.length === 0) {
        return undefined;
      }

      const coordinates = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };

      if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
        continue; // Try next endpoint
      }

      return coordinates;
    } catch (error) {
      console.error(`Error with endpoint ${baseUrl}:`, error);
      continue; // Try next endpoint
    }
  }

  throw new Error('Location service unavailable. Please try again later.');
}