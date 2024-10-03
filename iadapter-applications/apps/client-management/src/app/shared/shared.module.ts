import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design.modules';

@NgModule({
  declarations: [],
  imports: [CommonModule, ...antDesignModules],
})
export class SharedModule {}
