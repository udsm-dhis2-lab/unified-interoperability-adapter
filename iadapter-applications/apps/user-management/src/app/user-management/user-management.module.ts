import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management.routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserManagementRoutingModule, UserManagementComponent],
})
export class UserManagementModule {}
