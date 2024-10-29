import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientManagementRoutingModule } from './client-management-routing.module';
import { ClientManagementComponent } from './client-management.component';

@NgModule({
  declarations: [ClientManagementComponent],
  imports: [CommonModule, ClientManagementRoutingModule],
})
export class ClientManagementModule {}
