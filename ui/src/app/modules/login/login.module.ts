import { SharedModule } from 'src/app/shared/shared.modules';
import { loginComponents } from '.';
import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login.routing.module';

@NgModule({
  imports: [LoginRoutingModule, SharedModule],
  exports: [],
  entryComponents: [],
  declarations: [...loginComponents],
})
export class LoginModule {}
