import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  constructor() {}

  hasPrivilege(privileges: string[]): boolean {
    const userObject = JSON.parse(localStorage.getItem('current_user') || '{}');
    const userPrivileges = userObject.authorities || [];
    return privileges.some((privilege) => userPrivileges.includes(privilege));
  }
}
