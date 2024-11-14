import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralSettingsHomeComponent } from './containers/general-settings-home/general-settings-home.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralSettingsHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSettingsRoutingModule {}
