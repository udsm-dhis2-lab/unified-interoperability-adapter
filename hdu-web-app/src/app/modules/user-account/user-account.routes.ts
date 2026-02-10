export const userAccountRoutes = [
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile').then((m) => m.UserProfile),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/user-settings/user-settings').then((m) => m.UserSettings),
  },
];
