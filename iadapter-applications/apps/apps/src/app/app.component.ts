import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Fn } from '@iapps/function-analytics';
import { Menu } from './shared/menu.model';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { filter } from 'rxjs/operators';

@Component({
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  title = 'apps-shell';
  appName = 'Dashboard'; // Default value

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

  ngOnInit() {
    // Initialize the appName based on the current route when the component loads
    this.updateAppNameFromRoute(this.router.url);

    // Subscribe to router events to update appName when navigation occurs
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateAppNameFromRoute(event.url);
    });
  }

  updateAppNameFromRoute(url: string) {
    // Extract the first segment of the URL path
    const mainPath = url.split('/')[1] || 'dashboard';

    // Map paths to their corresponding display names
    const pathToNameMap: {[key: string]: string} = {
      'dashboard': 'Dashboard',
      'client-management': 'Client Management',
      'shr-management': 'SHR Management',
      'appointment-management': 'Appointment Management',
      'workflows-management': 'Workflows Management',
      'mapping-and-data-extraction': 'Mapping and Data Extraction',
      'settings': 'Settings'
    };

    // Update appName based on the current path
    this.appName = pathToNameMap[mainPath] || 'Dashboard';
  }

  onGetSelectedMenu(menu: Menu): void {
    // Update appName when a menu is selected
    this.appName = menu.name;
    this.router.navigate([menu.routeUrl]);
  }
}
