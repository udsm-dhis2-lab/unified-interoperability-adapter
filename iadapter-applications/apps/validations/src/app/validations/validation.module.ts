import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationComponent } from './validation.component';
import { ValidationsRoutingModule } from './validation.routing.module';
import { RuleBuilderComponent } from '../modules/home/containers/rule-builder/rule-builder.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ValidationsRoutingModule, ValidationComponent],
})
export class ValidationModule {}
