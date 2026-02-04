import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { Fn } from '@iapps/function-analytics';
import { Menu } from './shared/menu.model';
import { NgxDhis2HttpClientService } from '@iapps/ngx-dhis2-http-client';
import { filter, takeUntil } from 'rxjs/operators';
import { HduApiTopBarMenuComponent } from '../../../../libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { HduApiNavMenuComponent } from '../../../../libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { LayoutService } from '../../../../libs/shared/services/layout.service';
import { LoginService } from 'apps/login/src/app/modules/home/services/login.service';

@Component({
  providers: [],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
  imports: [
    CommonModule,
    RouterOutlet,
    HduApiTopBarMenuComponent,
    HduApiNavMenuComponent,
    NzLayoutModule,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'apps-shell';
  appName = 'Dashboard'; // Default value
  showNavigation$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private loginService: LoginService,
    private httpClient: NgxDhis2HttpClientService,
    private layoutService: LayoutService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.showNavigation$ = this.layoutService.showNavigation$;
    this.httpClient.manifest().subscribe((manifest) => {
      if (Fn) {
        Fn.init({
          baseUrl: manifest?.activities?.dhis?.href,
        });
      }
    });
  }

  ngOnInit() {
    this.updateAppNameFromRoute(this.router.url);
    this.updateBodyClass(this.router.url);

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.updateAppNameFromRoute(event.url);
        this.updateBodyClass(event.url);
      });

    this.showNavigation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((showNav) => {
        if (showNav) {
          this.document.body.classList.remove('login-page');
        } else {
          this.document.body.classList.add('login-page');
        }
      });
    
      if(!this.loginService.isAuthenticated()){
        this.router.navigate(['login'])
      }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Clean up body classes
    this.document.body.classList.remove('login-page');
  }

  updateAppNameFromRoute(url: string) {
    const mainPath = url.split('/')[1] || 'dashboard';

    // Map paths to their corresponding display names
    const pathToNameMap: { [key: string]: string } = {
      dashboard: 'Dashboard',
      'client-management': 'Client Management',
      'shr-management': 'SHR Management',
      'appointment-management': 'Appointment Management',
      'workflows-management': 'Workflows Management',
      'mapping-and-data-extraction': 'Mapping and Data Extraction',
      'user-management': 'User Management',
      account: 'Account Settings',
      settings: 'Settings',
    };

    this.appName = pathToNameMap[mainPath] || 'Dashboard';
  }

  updateBodyClass(url: string) {
    const isLoginPage = url.startsWith('/login');
    if (isLoginPage) {
      this.document.body.classList.add('login-page');
    } else {
      this.document.body.classList.remove('login-page');
    }
  }

  onGetSelectedMenu(menu: Menu): void {
    // Update appName when a menu is selected
    this.appName = menu.name;
    this.router.navigate([menu.routeUrl]);
  }
}
