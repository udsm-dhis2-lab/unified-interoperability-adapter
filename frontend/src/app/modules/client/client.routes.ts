export const clientRoutes = [
  {
    path: '',
    loadComponent: () => import('./pages/client-list/client-list').then((m) => m.ClientListPage),
  },
  {
    path: 'profile/:clientId',
    loadComponent: () =>
      import('./pages/client-profile/client-profile').then((m) => m.ClientProfile),
  },
  {
    path: 'deduplication',
    loadComponent: () =>
      import('./pages/deduplication-dashboard/deduplication-dashboard').then(
        (m) => m.DeduplicationDashboard,
      ),
  },
  {
    path: 'deduplication/:groupId',
    loadComponent: () =>
      import('./pages/duplicate-review/duplicate-review').then((m) => m.DuplicateReview),
  },
];
