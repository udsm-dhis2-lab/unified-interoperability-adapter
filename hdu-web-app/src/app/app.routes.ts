import { Routes } from '@angular/router';
import { authGuard } from '@hdu/core';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/clients' },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboards',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.routes').then((m) => m.dashboardRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    loadChildren: () => import('./modules/client/client.routes').then((m) => m.clientRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'shared-health-records',
    loadChildren: () =>
      import('./modules/shared-health-record/shared-health-record.routes').then(
        (m) => m.sharedHealthRecordRoutes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'appointments',
    loadChildren: () =>
      import('./modules/appointment/appointment.routes').then((m) => m.appointmentRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'access-control',
    loadChildren: () =>
      import('./modules/access-control/access-control.routes').then((m) => m.accessControlRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'facility-management',
    loadChildren: () =>
      import('./modules/facility-management/facility-management.routes').then(
        (m) => m.facilityManagementRoutes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'system-connections',
    loadChildren: () =>
      import('./modules/system-connection/system-connection.routes').then(
        (m) => m.systemConnectionRoutes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'terminology-services',
    loadChildren: () =>
      import('./modules/terminology-service/terminology-service.routes').then(
        (m) => m.terminologyServiceRoutes,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'validations',
    loadChildren: () =>
      import('./modules/validation/validation.routes').then((m) => m.validationRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'data-sets',
    loadChildren: () => import('./modules/data-set/data-set.routes').then((m) => m.dataSetRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'user-account',
    loadChildren: () =>
      import('./modules/user-account/user-account.routes').then((m) => m.userAccountRoutes),
    canActivate: [authGuard],
  },
];
