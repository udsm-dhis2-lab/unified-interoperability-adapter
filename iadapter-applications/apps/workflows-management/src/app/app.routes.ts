import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () =>
            import('../app/pages/home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('../app/pages/home/home.module').then((m) => m.HomeModule),
    },
    // {
    //   path: 'deduplication',
    //   loadChildren: () =>
    //     import('./modules/deduplication/deduplication.module').then(
    //       (m) => m.DeduplicationModule
    //     ),
    // },
];
