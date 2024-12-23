export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
  }
  
  export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface LocationState {
    address: Address;
    coordinates: Coordinates | null;
  }