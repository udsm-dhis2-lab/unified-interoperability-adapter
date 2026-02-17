export const facilityManagementRoutes = [
  {
    path: '',
    loadComponent: () => import('./pages/facility-list/facility-list').then((m) => m.FacilityList),
  },
  {
    path: ':facilityId/profile',
    loadComponent: () =>
      import('./pages/facility-profile/facility-profile').then((m) => m.FacilityProfile),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/facility-registration/facility-registration').then(
        (m) => m.FacilityFormComponent,
      ),
  },
  {
    path: ':facilityId/referral-configuration',
    loadComponent: () =>
      import('./pages/facility-referral-configuration/facility-referral-configuration').then(
        (m) => m.FacilityReferralConfiguration,
      ),
  },
];
