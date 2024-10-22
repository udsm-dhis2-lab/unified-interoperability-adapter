import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design.modules';

@NgModule({
  imports: [CommonModule, ...antDesignModules],
  exports: [...antDesignModules, CommonModule],
})
export class SharedModule {}
