export const accessControlRoutes = [
  {
    path: 'users',
    loadComponent: () => import('./pages/user-list/users-list').then((m) => m.UsersList),
  },
  {
    path: 'users/create',
    loadComponent: () => import('./pages/user-create/user-create').then((m) => m.UserCreate),
  },
  {
    path: 'users/:userId/edit',
    loadComponent: () => import('./pages/user-create/user-create').then((m) => m.UserCreate),
  },
  
  {
    path: 'user-roles',
    loadComponent: () =>
      import('./pages/user-role-list/user-role-list').then((m) => m.UserRoleList),
  },
  {
    path: 'user-roles/create',
    loadComponent: () =>
      import('./pages/user-role-create/user-role-create').then((m) => m.UserRoleCreate),
  },
  {
    path: 'user-roles/:roleId/edit',
    loadComponent: () =>
      import('./pages/user-role-create/user-role-create').then((m) => m.UserRoleCreate),
  },
  {
    path: 'user-authorities',
    loadComponent: () =>
      import('./pages/user-permissions-list/user-permissions-list').then((m) => m.UserAuthorityList),
  },
  {
    path: 'user-authorities/create',
    loadComponent: () =>
      import('./pages/user-permissions-create/user-permissions-create').then(
        (m) => m.UserAuthorityCreate,
      ),
  },
];
