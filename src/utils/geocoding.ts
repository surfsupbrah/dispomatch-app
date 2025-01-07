import type { Coordinates } from '../types';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

<<<<<<< HEAD
=======
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

>>>>>>> parent of 84ecf17 (geolocation #8)
export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
<<<<<<< HEAD
    const encodedQuery = encodeURIComponent(`${query}, USA`);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'DispoMatch Healthcare Facility Finder'
        }
=======
    // Add proper delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encodedQuery = encodeURIComponent(query);
    const response = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'DispoMatch Healthcare Facility Finder (dispomatch@example.com)',
          'Accept-Language': 'en'
        },
        mode: 'cors',
        cache: 'no-cache'
>>>>>>> parent of 84ecf17 (geolocation #8)
      }
    );
    
    if (!response.ok) {
<<<<<<< HEAD
      throw new Error('Geocoding request failed');
=======
      throw new Error('Location service temporarily unavailable');
>>>>>>> parent of 84ecf17 (geolocation #8)
    }

    const data = await response.json() as NominatimResponse[];
    
    if (data.length === 0) {
<<<<<<< HEAD
      console.log('No results found for query:', query);
=======
>>>>>>> parent of 84ecf17 (geolocation #8)
      return undefined;
    }

    const coordinates = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
<<<<<<< HEAD
  } catch (error) {
    console.error('Geocoding error:', error);
    return undefined;
=======

    if (isNaN(coordinates.lat) || isNaN(coordinates.lng)) {
      throw new Error('Invalid coordinates received');
    }

    return coordinates;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error('Location service temporarily unavailable. Please try again later.');
>>>>>>> parent of 84ecf17 (geolocation #8)
  }
}