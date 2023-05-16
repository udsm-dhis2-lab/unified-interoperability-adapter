import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.modules';
import { containers } from './containers';
import { components } from './components';
import { IAdapterDashboardRoutingModule } from './iadapter-dashboard.routing.module';

@NgModule({
  imports: [IAdapterDashboardRoutingModule, SharedModule],
  exports: [],
  entryComponents: [...components],
  declarations: [...containers, ...components],
})
export class IAdapterDashboardModule {}
