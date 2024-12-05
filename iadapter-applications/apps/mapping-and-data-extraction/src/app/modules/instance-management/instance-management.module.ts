import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components } from './components';
import { InstancesManagementRoutingModule } from './instance-management-routing.module';

@NgModule({
  declarations: [...components],
  imports: [CommonModule, InstancesManagementRoutingModule],
})
export class InstanceManagementModule {}
