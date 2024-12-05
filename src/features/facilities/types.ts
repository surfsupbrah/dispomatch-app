export interface FacilityContact {
  name: string;
  email: string;
  phoneExt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType[];
  location: string;
  phone: string;
  fax: string;
  contact: FacilityContact;
  imageUrl: string;
  insurances: Insurance[];
  services: Service[];
  bedAvailability: BedAvailability;
}