import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationComponent } from './validation.component';
import { ValidationsRoutingModule } from './validation.routing.module';



@NgModule({
  declarations: [ValidationComponent],
  imports: [
    CommonModule,
    ValidationsRoutingModule
  ]
})
export class ValidationModule { }
