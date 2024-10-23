import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/mappings/mappings.module').then(
        (m) => m.MappingsModule
      ),
  },
];
