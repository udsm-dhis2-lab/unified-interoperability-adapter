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
import { routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appEffects, appReducers, metaReducers } from './store/app.state';

const icons: IconDefinition[] = [...antDesignIcons];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideClientHydration(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({ reducer: routerReducer }),
    provideStore(appReducers, { metaReducers }),
    provideEffects(appEffects),
    provideStoreDevtools({
      logOnly: !isDevMode(),
    }),
    provideEffects(),
    provideRouter(appRoutes),
    { provide: NZ_ICONS, useValue: icons },
  ],
};
