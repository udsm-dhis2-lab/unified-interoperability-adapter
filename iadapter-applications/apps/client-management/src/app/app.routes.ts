import { Route } from '@angular/router';
import { DeduplicationDetailsComponent } from './modules/deduplication/containers/deduplication-details/deduplication-details.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'deduplication',
    loadChildren: () =>
      import('./modules/deduplication/deduplication.module').then(
        (m) => m.DeduplicationModule
      ),
  },
  {
    path: 'deduplication/deduplication-details',
    component: DeduplicationDetailsComponent,
  },
];
