import { Route } from '@angular/router';
import { AuthGuard } from '../../../../libs/shared/guards/auth.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('@iapps/d2-dashboard').then((m) => m.D2DashboardModule),
  },
  {
    path: 'client-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/client-management/src/app/client-management/client-management.module'
      ).then((m) => m.ClientManagementModule),
  },
  {
    path: 'mapping-and-data-extraction',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/mapping-and-data-extraction/src/app/mapping-and-data-extraction/mapping-and-data-extraction.module'
      ).then((m) => m.MappingAndDataExtractionModule),
  },
  {
    path: 'workflows-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/workflows-management/src/app/workflows-management/workflows-management.module'
      ).then((m) => m.WorkflowsManagementModule),
  },
  {
    path: 'shr-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/referral-management/src/app/referral-management/referral-management.module'
      ).then((m) => m.ReferralManagementModule),
  },
  {
    path: 'user-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/user-management/src/app/user-management/user-management.module'
      ).then((m) => m.UserManagementModule),
  },
  {
    path: 'validations',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/validations/src/app/validations/validation.module'
      ).then((m) => m.ValidationModule),
  },

  {
    path: 'appointment-management',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        '../../../appointment-management/src/app/appointment-management/appointment-management.module'
      ).then((m) => m.AppointmentManagementModule),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import(
        './../../../../apps/settings/src/app/settings/settings.module'
      ).then((m) => m.SettingsModule),
  },
];
