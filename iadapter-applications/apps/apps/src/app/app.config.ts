import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { IconDefinition } from '@ant-design/icons-angular';
import { antDesignIcons } from './shared/ant-design-icons.constants';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule, provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appEffects, appReducers, metaReducers } from './store/app.state';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { registerLocaleData } from '@angular/common';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LogMonitorModule } from 'ngx-log-monitor';

const icons: IconDefinition[] = [...antDesignIcons];
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(MonacoEditorModule),
    importProvidersFrom(LogMonitorModule),
    importProvidersFrom(BrowserModule),
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
    { provide: NZ_I18N, useValue: en_US }
  ],
};
