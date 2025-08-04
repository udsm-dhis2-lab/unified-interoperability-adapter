import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsHomeComponent } from './containers/settings-home/settings-home.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    SettingsRoutingModule,
    SettingsHomeComponent,
  ],
})
export class SettingsModule {}
