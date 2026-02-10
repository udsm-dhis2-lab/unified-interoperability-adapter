export const terminologyServiceRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/terminology-service-list/terminology-service-list').then(
        (m) => m.TerminologyServiceList,
      ),
  },
];
