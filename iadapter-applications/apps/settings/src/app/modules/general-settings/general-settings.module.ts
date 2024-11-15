import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { containers } from './containers';
import { components } from './components';
import { GeneralSettingsRoutingModule } from './general-settings-routing.module';

@NgModule({
  declarations: [...containers, ...components],
  imports: [CommonModule, GeneralSettingsRoutingModule],
})
export class GeneralSettingsModule {}
