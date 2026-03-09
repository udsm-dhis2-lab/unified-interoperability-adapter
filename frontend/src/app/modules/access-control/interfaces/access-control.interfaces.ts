export interface Role {
  uuid: string;
  roleName: string;
}


export interface User {
  uuid?: string;
  username: string;
  firstName?: string;
  middleName?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  disabled?: boolean;
  roles: Role[];
}

export interface Privilege {
  uuid?: string;
  privilegeName: string;
  description?: string;
  roles?: Role[];
  sharing?: string;
}