import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HduApiTopBarMenuComponent } from '../../../../libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { HduApiNavMenuComponent } from '../../../../libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { antDesignModules } from './shared/ant-design-modules';
import { Menu } from './shared/menu.model';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';

@Component({
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'apps-shell';

  constructor(
    private router: Router,
    private httpClient: NgxDhis2HttpClientService
  ) {
    this.httpClient.me().subscribe((response) => {
      console.log('user info', response);
      // TODO: Handle user permissions and roles here
    });
  }

  onGetSelectedMenu(menu: Menu): void {
    this.router.navigate([menu.routeUrl]);
  }
}
