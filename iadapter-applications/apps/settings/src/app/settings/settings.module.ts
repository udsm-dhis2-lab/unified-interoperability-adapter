import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { containers } from './containers';

@NgModule({
  declarations: [...containers],
  imports: [CommonModule, SettingsRoutingModule],
})
export class SettingsModule {}
