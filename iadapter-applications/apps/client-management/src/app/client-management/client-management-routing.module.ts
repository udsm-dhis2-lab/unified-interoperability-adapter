import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientManagementComponent } from './client-management.component';

const routes: Routes = [
  {
    path: '',
    component: ClientManagementComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./../modules/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'deduplication',
        loadChildren: () =>
          import('./../modules/deduplication/deduplication.module').then(
            (m) => m.DeduplicationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientManagementRoutingModule {}
