import { SharedModule } from 'src/app/shared/shared.modules';
import { NgModule } from '@angular/core';
import { components } from './components';
import { ImportExportRoutingModule } from './import-export.routing.module';
import { pages } from './pages';

@NgModule({
  imports: [ImportExportRoutingModule, SharedModule],
  exports: [...components, ...pages],
  entryComponents: [],
  declarations: [...components, ...pages],
})
export class ImportExportModule {}
