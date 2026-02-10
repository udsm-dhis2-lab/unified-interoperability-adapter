export const validationRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/validation-list/validation-list').then((m) => m.ValidationList),
  },
];
