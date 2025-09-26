import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import en from '@angular/common/locales/en';
import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  NgModule,
  provideZoneChangeDetection,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouterModule } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import { D2DashboardModule } from '@iapps/d2-dashboard';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import {
  provideRouterStore,
  routerReducer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { provideStore, StoreModule } from '@ngrx/store';
import {
  provideStoreDevtools,
  StoreDevtoolsModule,
} from '@ngrx/store-devtools';
import { AppComponent } from 'apps/apps/src/app/app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { LogMonitorModule } from 'ngx-log-monitor';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { HduApiNavMenuComponent } from '../../../../libs/hdu-api-nav-menu/src/lib/hdu-api-nav-menu/hdu-api-nav-menu.component';
import { HduApiTopBarMenuComponent } from '../../../../libs/hdu-api-top-bar-menu/src/lib/hdu-api-top-bar-menu/hdu-api-top-bar-menu.component';
import { appRoutes } from './app.routes';
import { antDesignIcons } from './shared/ant-design-icons.constants';
import { antDesignModules } from './shared/ant-design-modules';
import { appEffects, appReducers, metaReducers } from './store/app.state';
import { AuthInterceptor } from '../../../../libs/models/src/lib/exceptions/exceptions';
import { JwtInterceptor } from '../../../../libs/shared/interceptors/jwt.interceptor';

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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
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
    AppComponent,
  ],
  declarations: [],
  providers: [
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Allows multiple interceptors
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
