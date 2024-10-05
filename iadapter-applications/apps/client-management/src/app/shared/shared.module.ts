import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design.modules';
import { components } from './components/index';

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ...antDesignModules],
  exports: [...components]
})
export class SharedModule {}
