export const sharedHealthRecordRoutes = [
  {
    path: '',
    loadComponent: () => import('./pages/shr-list/shr-list').then((m) => m.ShrList),
  },

  {
    path: 'profile/:clientId',
    loadComponent: () => import('./pages/shr-profile/shr-profile').then((m) => m.ShrProfile),
  },
  {
    path: 'referrals',
    loadComponent: () => import('./pages/referral-list/referral-list').then((m) => m.ReferralList),
  },
  {
    path: 'referrals/:referralId',
    loadComponent: () =>
      import('./pages/referral-profile/referral-profile').then((m) => m.ReferralProfile),
  },
];
