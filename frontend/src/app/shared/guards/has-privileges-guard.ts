import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthorizationService } from '../services/authorization';
import { NzMessageService } from 'ng-zorro-antd/message';

export const hasPrivilegesGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthorizationService);
  const message = inject(NzMessageService);
  const requiredPrivileges = route.data['privileges'] as string[];

  if (auth.hasPrivilege(requiredPrivileges)) {
    return true;
  }

  message.error('You do not have the required privileges to access this page.');
  return false;
};
