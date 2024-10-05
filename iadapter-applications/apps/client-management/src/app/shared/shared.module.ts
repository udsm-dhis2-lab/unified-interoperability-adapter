import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design.modules';
import { SearchComponent } from './components/index';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, ...antDesignModules],
})
export class SharedModule {}
