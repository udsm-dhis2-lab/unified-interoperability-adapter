import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { antDesignModules } from './ant-design.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, ...antDesignModules, FormsModule],
  exports: [CommonModule, ...antDesignModules, FormsModule],
})
export class SharedModule {}
