import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { CoreModule } from './core/core.module';
import { HduApiTopBarMenuComponent } from 'libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { antDesignModules } from './shared/ant-design.modules';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule,
    CoreModule,
    HduApiTopBarMenuComponent,
    ...antDesignModules,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'client-management';

  isCollapsed = false;
  handleCollapseChange() {
    this.isCollapsed = !this.isCollapsed;
  }
}
