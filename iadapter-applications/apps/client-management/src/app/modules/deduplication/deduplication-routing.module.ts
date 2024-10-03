import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeduplicationHomeComponent } from './containers/deduplication-home/deduplication-home.component';

const routes: Routes = [
  {
    path: '',
    component: DeduplicationHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeduplicationRoutingModule {}
