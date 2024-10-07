import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeduplicationHomeComponent } from './containers/deduplication-home/deduplication-home.component';
import { DeduplicationDetailsComponent } from './containers/deduplication-details/deduplication-details.component';

const routes: Routes = [
  {
    path: '',
    component: DeduplicationHomeComponent,
  },
  {
    path: 'deduplication-details',
    component: DeduplicationDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeduplicationRoutingModule {}
