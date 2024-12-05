export interface SearchFilters {
  facilityTypes: FacilityType[];
  insurances: Insurance[];
  services: Service[];
  availableBeds: 'yes' | 'no' | 'any';
}

export interface SearchResult extends Facility {
  matchPercentage: number;
}