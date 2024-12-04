import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Fn } from '@iapps/function-analytics';
import { Menu } from './shared/menu.model';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { manifest } from '@ant-design/icons-angular';

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
    this.httpClient.manifest().subscribe((manifest) => {
      if (Fn) {
        Fn.init({
          baseUrl: manifest?.activities?.dhis?.href,
        });
      }
    });
  }

  onGetSelectedMenu(menu: Menu): void {
    this.router.navigate([menu.routeUrl]);
  }
}
