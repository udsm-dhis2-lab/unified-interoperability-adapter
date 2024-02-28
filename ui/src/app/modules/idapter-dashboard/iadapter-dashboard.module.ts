import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.modules';
import { containers } from './containers';
import { components } from './components';
import { IAdapterDashboardRoutingModule } from './iadapter-dashboard.routing.module';
import { modals } from './components/sources/modals';

@NgModule({
  imports: [IAdapterDashboardRoutingModule, SharedModule],
  exports: [],
  entryComponents: [...components, ...modals],
  declarations: [...containers, ...components, ...modals],
})
export class IAdapterDashboardModule {}
