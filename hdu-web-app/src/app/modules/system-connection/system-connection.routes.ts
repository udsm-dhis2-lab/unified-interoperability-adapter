export const systemConnectionRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/system-connection-list/system-connection-list').then(
        (m) => m.SystemConnection,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/system-connection-create/system-connection-create').then(
        (m) => m.SystemConnectionCreate,
      ),
  },
  {
    path: ':systemId/edit',
    loadComponent: () =>
      import('./pages/system-connection-edit/system-connection-edit').then(
        (m) => m.SystemConnectionEdit,
      ),
  },
];
