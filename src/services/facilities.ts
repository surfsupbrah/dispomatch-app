import { supabase } from '../lib/supabase';
import type { Facility } from '../types';

export async function getFacilities() {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createFacility(facility: Omit<Facility, 'id'>) {
  const { data, error } = await supabase
    .from('facilities')
    .insert([{
      name: facility.name,
      type: facility.type,
      location: facility.location,
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
  return data;
}

export async function updateFacility(id: string, facility: Partial<Omit<Facility, 'id'>>) {
  const { data, error } = await supabase
    .from('facilities')
    .update({
      name: facility.name,
      type: facility.type,
      location: facility.location,
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
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFacility(id: string) {
  const { error } = await supabase
    .from('facilities')
    .delete()
    .eq('id', id);

  if (error) throw error;
}