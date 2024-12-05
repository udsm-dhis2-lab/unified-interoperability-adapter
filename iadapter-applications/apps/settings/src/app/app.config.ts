import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { IconDefinition } from '@ant-design/icons-angular';
import { antDesignIcons } from './shared/ant-design-icons.contants';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
const icons: IconDefinition[] = [...antDesignIcons];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: NZ_ICONS, useValue: icons },
  ],
};
