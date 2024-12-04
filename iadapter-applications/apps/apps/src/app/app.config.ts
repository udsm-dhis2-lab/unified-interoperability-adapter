import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  NgModule,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { IconDefinition } from '@ant-design/icons-angular';
import { antDesignIcons } from './shared/ant-design-icons.constants';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { appRoutes } from './app.routes';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import {
  routerReducer,
  StoreRouterConnectingModule,
  provideRouterStore,
} from '@ngrx/router-store';
import {
  provideStoreDevtools,
  StoreDevtoolsModule,
} from '@ngrx/store-devtools';
import { appEffects, appReducers, metaReducers } from './store/app.state';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LogMonitorModule } from 'ngx-log-monitor';
import { ReactiveFormsModule } from '@angular/forms';
import { D2DashboardModule } from '@iapps/d2-dashboard';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { AppComponent } from 'apps/apps/src/app/app.component';
import { HduApiTopBarMenuComponent } from '../../../../libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { HduApiNavMenuComponent } from '../../../../libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { antDesignModules } from './shared/ant-design-modules';

const icons: IconDefinition[] = [...antDesignIcons];
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(MonacoEditorModule),
    importProvidersFrom(
      D2DashboardModule.forRoot({
        useDataStore: false,
        dataStoreNamespace: 'hdu-dashboard',
        rootUrl: 'dashboard',
      })
    ),
    importProvidersFrom(
      NgxDhis2HttpClientModule.forRoot({
        version: 1,
        namespace: 'hdu',
        models: {},
      })
    ),
    importProvidersFrom(StoreModule.forRoot({})),
    importProvidersFrom(EffectsModule.forRoot([])),
    importProvidersFrom(LogMonitorModule),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(ReactiveFormsModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(StoreRouterConnectingModule),
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ reducer: routerReducer }),
    provideStore(appReducers, { metaReducers }),
    provideRouter(appRoutes),
    provideEffects(appEffects),
    provideStoreDevtools({
      logOnly: !isDevMode(),
    }),
    provideRouterStore(),
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_I18N, useValue: en_US },
  ],
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    D2DashboardModule.forRoot({
      useDataStore: false,
      dataStoreNamespace: 'hdu-dashboard',
      rootUrl: 'dashboard',
    }),
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: 'hdu',
      models: {},
    }),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    StoreModule.forRoot(appReducers, { metaReducers }),
    EffectsModule.forRoot(appEffects),
    HduApiTopBarMenuComponent,
    HduApiNavMenuComponent,
    ...antDesignModules,
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      logOnly: !isDevMode(),
    }),
  ],
  declarations: [AppComponent],
  providers: [
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
