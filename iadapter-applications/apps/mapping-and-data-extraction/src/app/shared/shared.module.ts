import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design-modules';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ...antDesignModules, FormsModule],
  exports: [...antDesignModules, CommonModule, FormsModule],
})
export class SharedModule {}
