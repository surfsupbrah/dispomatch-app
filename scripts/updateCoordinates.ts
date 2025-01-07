import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCoordinatesFromSearch(query: string): Promise<{ lat: number; lng: number } | null> {
  if (!query.trim()) return null;
  
  try {
    // Format address to match Google's format
    const formattedQuery = query
      .replace(/\s+/g, ' ')  // Normalize spaces
      .replace(/,\s*/g, ',') // Remove spaces after commas
      .trim();
    
    // Ensure address ends with state and country
    const addressWithState = formattedQuery.match(/[A-Z]{2}$/i) 
      ? `${formattedQuery}, USA`
      : `${formattedQuery}, RI, USA`;
    
    const encodedQuery = encodeURIComponent(addressWithState);
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    console.log(`Geocoding "${addressWithState}":`, data);
    
    if (!data || data.length === 0) {
      console.log(`No coordinates found for: ${addressWithState}`);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error(`Geocoding error for ${query}:`, error);
    return null;
  }
}

async function updateFacilityCoordinates() {
  console.log('Starting coordinates update...');

  try {
    const { data: facilities, error: fetchError } = await supabase
      .from('facilities')
      .select('id, location');

    if (fetchError) throw fetchError;

    if (!facilities || facilities.length === 0) {
      console.log('No facilities found needing coordinate updates');
      return;
    }

    console.log(`Found ${facilities.length} facilities to update`);

    for (const facility of facilities) {
      try {
        console.log(`Processing facility ${facility.id}: ${facility.location}`);
        
        const coordinates = await getCoordinatesFromSearch(facility.location);
        
        if (!coordinates) {
          console.log(`No coordinates found for location: ${facility.location}`);
          continue;
        }

        console.log(`Found coordinates for ${facility.location}:`, coordinates);

        const { error: updateError } = await supabase
          .from('facilities')
          .update({
            latitude: coordinates.lat,
            longitude: coordinates.lng
          })
          .eq('id', facility.id);

        if (updateError) {
          console.error(`Error updating facility ${facility.id}:`, updateError);
          continue;
        }

        console.log(`Updated coordinates for facility ${facility.id}`);
        
      } catch (err) {
        console.error(`Error processing facility ${facility.id}:`, err);
      }
    }

    console.log('Coordinate update process completed');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error during update process:', err);
    process.exit(1);
  }
}

updateFacilityCoordinates().catch(console.error);