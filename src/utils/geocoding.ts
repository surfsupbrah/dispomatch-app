import type { Coordinates } from '../types';

export async function getCoordinatesFromSearch(query: string): Promise<Coordinates | undefined> {
  if (!query.trim()) return undefined;
  
  try {
    // Format address
    const formattedQuery = query
      .replace(/\s+/g, ' ')
      .replace(/,\s*/g, ',')
      .trim();
    
    const addressWithState = formattedQuery.match(/[A-Z]{2}$/i) 
      ? `${formattedQuery}, USA`
      : `${formattedQuery}, RI, USA`;
    
    const encodedQuery = encodeURIComponent(addressWithState);
    
    // Use HTTPS endpoint
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'DispoMatch Healthcare Facility Finder (dispomatchapp@gmail.com)'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
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