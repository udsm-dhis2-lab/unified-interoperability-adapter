import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '',
    loadChildren: () =>
      import('./core/core.routes').then(m => m.coreRoutes)
  },
  { path: '**', pathMatch: 'full', redirectTo: 'clients' },
  
];
