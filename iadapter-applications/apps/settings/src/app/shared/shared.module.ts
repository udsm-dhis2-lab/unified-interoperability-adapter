import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { antDesignModules } from './ant-design.module';

@NgModule({
  declarations: [],
  imports: [...antDesignModules, FormsModule],
  exports: [...antDesignModules, FormsModule],
})
export class SharedModule {}
