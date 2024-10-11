import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './config/ant-design.modules';

@NgModule({
  declarations: [],
  imports: [CommonModule, ...antDesignModules],
  exports: [...antDesignModules, CommonModule],
})
export class SharedModule {}
