export interface ClientDetails {
  pager: Pager;
  results: Result[];
}

export interface Pager {
  total: number;
  totalPages: number;
  pageSize: number;
  page: number;
}

export interface Result {
  facilityDetails: FacilityDetails;
  demographicDetails: DemographicDetails;
}

export interface FacilityDetails {
  code: string;
  name: string;
  bloodBags: number;
}

export interface DemographicDetails {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumbers: string[];
  emails: string[];
  occupation: string;
  maritalStatus: string;
  nationality: string;
  addresses: Address[];
  identifiers: Identifier[];
  contactPeople: ContactPeople[];
  paymentDetails: string[];
  relatedClients: string[];
  appointment: string[];
}

export interface Address {
  village: string;
  ward: string;
  district: string;
  region: string;
  country: string;
  category: string;
}

export interface Identifier {
  id: string;
  type: string;
  preferred: boolean;
  system: string;
  organization: string;
}

export interface ContactPeople {
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  relationShip: string;
}
