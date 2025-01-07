import { supabase } from '../lib/supabase';
import { getCoordinatesFromSearch } from '../utils/geocoding';
import type { Facility } from '../types';

export async function getFacilities() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('user_id', user.id)
    .order('name');

  if (error) throw error;
  return transformFacilities(data);
}

export async function searchFacilities() {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('name');

  if (error) throw error;
  return transformFacilities(data);
}

export async function createFacility(facility: Omit<Facility, 'id' | 'updatedAt'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const coordinates = await getCoordinatesFromSearch(facility.location);

  const { data, error } = await supabase
    .from('facilities')
    .insert([{
      user_id: user.id,
      name: facility.name,
      type: facility.type,
      location: facility.location,
      latitude: coordinates?.lat,
      longitude: coordinates?.lng,
      phone: facility.phone,
      fax: facility.fax,
      contact_name: facility.contact.name,
      contact_email: facility.contact.email,
      contact_phone_ext: facility.contact.phoneExt,
      image_url: facility.imageUrl,
      insurances: facility.insurances,
      services: facility.services,
      bed_availability: facility.bedAvailability
    }])
    .select()
    .single();

  if (error) throw error;
  return transformFacility(data);
}

export async function updateFacility(id: string, facility: Partial<Omit<Facility, 'id' | 'updatedAt'>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let coordinates;
  if (facility.location) {
    coordinates = await getCoordinatesFromSearch(facility.location);
  }

  const { data, error } = await supabase
    .from('facilities')
    .update({
      name: facility.name,
      type: facility.type,
      location: facility.location,
      ...(coordinates && {
        latitude: coordinates.lat,
        longitude: coordinates.lng
      }),
      phone: facility.phone,
      fax: facility.fax,
      contact_name: facility.contact?.name,
      contact_email: facility.contact?.email,
      contact_phone_ext: facility.contact?.phoneExt,
      image_url: facility.imageUrl,
      insurances: facility.insurances,
      services: facility.services,
      bed_availability: facility.bedAvailability
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return transformFacility(data);
}

export async function deleteFacility(id: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('facilities')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function updateFacilityCoordinates(facility: Facility) {
  const coordinates = await getCoordinatesFromSearch(facility.location);
  
  if (!coordinates) {
    throw new Error('Could not find coordinates for location');
  }

  const { error } = await supabase
    .from('facilities')
    .update({
      latitude: coordinates.lat,
      longitude: coordinates.lng
    })
    .eq('id', facility.id);

  if (error) throw error;
  
  return coordinates;
}

function transformFacility(data: any): Facility {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    location: data.location,
    coordinates: data.latitude && data.longitude ? {
      lat: data.latitude,
      lng: data.longitude
    } : undefined,
    phone: data.phone,
    fax: data.fax,
    contact: {
      name: data.contact_name || '',
      email: data.contact_email || '',
      phoneExt: data.contact_phone_ext || '',
    },
    imageUrl: data.image_url,
    insurances: data.insurances,
    services: data.services,
    bedAvailability: data.bed_availability,
    updatedAt: data.updated_at,
  };
}

function transformFacilities(data: any[]): Facility[] {
  return data.map(transformFacility);
}
