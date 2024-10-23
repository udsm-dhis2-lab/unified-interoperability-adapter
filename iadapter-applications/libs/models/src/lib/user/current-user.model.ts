export interface CurrentUserModel {
  uuid: string;
  authenticated: boolean;
  displayName: string;
  firstName: string;
  lastName: string;
  username: string;
  externalAuth: string;
  groups: GroupModel[];
  email: string;
  roles: RoleModel[];
  authorities: string[];
  avatar: string;
}

export interface GroupModel {
  name: string;
  uuid: string;
}

export interface RoleModel {
  name?: string;
  rolename?: string;
  uuid: string;
}
