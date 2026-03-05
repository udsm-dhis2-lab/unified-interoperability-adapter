export const facilityManagementRoutes = [
  {
    path: '',
    loadComponent: () => import('./pages/facility-list/facility-list').then((m) => m.FacilityList),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/facility-registration/facility-registration').then(
        (m) => m.FacilityFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/facility-profile/facility-profile').then((m) => m.FacilityDetailsComponent),
  },
  {
    path: ':id/mediator',
    loadComponent: () =>
      import('./pages/facility-registration/facility-registration').then(
        (m) => m.FacilityFormComponent,
      ),
  },
];
