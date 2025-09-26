export interface User {
  firstName?: string;
  surname?: string;
  roles: Role[];
  externalAuth?: any;
  groups: Group[];
  middleName?: string;
  uuid: string;
  authorities: string[];
  username: string;
  phoneNumber?: string;
  email?: string;
  disabled?: boolean;
  // Additional fields that might be returned by the API
  createdAt?: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface Role {
  roleName: string;
  uuid: string;
}

export interface Group {
  uuid: string;
  name: string;
}

export interface Privilege {
  uuid: string;
  name: string;
}
