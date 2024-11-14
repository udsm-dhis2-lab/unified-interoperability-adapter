import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { containers } from './containers';
import { components } from './components';
import { InstancesRoutingModule } from './instances-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'settings/shared/shared.module';

@NgModule({
  declarations: [...containers, ...components],
  imports: [
    CommonModule,
    InstancesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class InstancesModule {}
