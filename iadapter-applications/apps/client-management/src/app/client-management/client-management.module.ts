import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientManagementRoutingModule } from './client-management-routing.module';
import { ClientManagementComponent } from './client-management.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientManagementRoutingModule,
    ClientManagementComponent,
  ],
})
export class ClientManagementModule {}
