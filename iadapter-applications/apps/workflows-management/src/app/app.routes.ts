import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadChildren: () =>
            import('../app/pages/workflow/workflow.module').then((m) => m.WorkflowModule),
    },
    {
        path: 'home',
        loadChildren: () =>
            import('../app/pages/workflow/workflow.module').then((m) => m.WorkflowModule),
    },
    // {
    //   path: 'deduplication',
    //   loadChildren: () =>
    //     import('./modules/deduplication/deduplication.module').then(
    //       (m) => m.DeduplicationModule
    //     ),
    // },
];
