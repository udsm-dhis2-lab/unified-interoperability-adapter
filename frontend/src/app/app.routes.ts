import { Routes } from '@angular/router';
import { authGuard } from '@hdu/core';
import { Login } from './core/components/login/login';

export const routes: Routes = [
  { 
    path: '',
    loadChildren: () =>
      import('./core/core.routes').then(m => m.coreRoutes)
  },

  { path: '**', pathMatch: 'full', redirectTo: 'clients' },
];
