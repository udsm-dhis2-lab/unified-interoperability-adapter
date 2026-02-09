export const dataSetRoutes = [
  {
    path: '',
    loadComponent: () => import('./pages/data-set-list/data-set-list').then((m) => m.DataSetList),
  },
];
