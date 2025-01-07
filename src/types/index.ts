export type BedAvailability = 'yes' | 'no' | 'unknown';

export type Insurance = 
  | 'Medicaid'
  | 'Medicare'
  | 'Blue Cross & Blue Shield'
  | 'Neighborhood Health'
  | 'UnitedHealthcare'
  | 'Tufts Health Plan'
  | 'Aetna'
  | 'Harvard Pilgrim'
  | 'Cigna'
  | 'AmeriHealth Caritas'
  | 'Molina'
  | 'Oscar'
  | 'Other';

export type Service =
  | 'OT'
  | 'PT'
  | 'Speech Therapy'
  | 'Wound Care'
  | 'Medication Administration'
  | 'IV Medication Administration'
  | 'Social Services'
  | 'Nutrition Services'
  | 'Palliative & Hospice Care'
  | 'Behavioral Health'
  | 'Mobility Assistance'
  | 'ADL Assistance'
  | '24-hour Nursing'
  | 'Memory Care'
  | 'Oxygen Therapy'
  | 'Transportation Services & Facility Transfers'
  | 'Interpreter Services'
  | 'Case Management';

export type FacilityType =
  | 'Skilled Nursing Facility'
  | 'Short Term Rehab'
  | 'Assisted Living Facility'
  | 'Inpatient Rehabilitation Unit'
  | 'Home Services Provider'
  | 'Long Term Acute Care Hospital (LTACH)';

export interface SearchFilters {
  facilityName: string;
  facilityTypes: FacilityType[];
  insurances: Insurance[];
  services: Service[];
  availableBeds: 'yes' | 'no' | 'any';
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType[];
  location: string;
  phone: string;
  fax: string;
  contact: {
    name: string;
    email: string;
    phoneExt: string;
  };
  imageUrl: string;
  insurances: Insurance[];
  services: Service[];
  bedAvailability: BedAvailability;
  updatedAt: string;
  coordinates?: Coordinates; 
}

export interface AuthState {
  isAuthenticated: boolean;
  facilities: Facility[];
}
export interface Coordinates {
  lat: number;
  lng: number;
}
export interface SearchFilters {
  facilityName: string;
  facilityTypes: FacilityType[];
  insurances: Insurance[];
  services: Service[];
  availableBeds: 'yes' | 'no' | 'any';
  location?: string;
  radius?: number;
  coordinates?: Coordinates;
}