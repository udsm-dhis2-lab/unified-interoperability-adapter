import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { IconDefinition } from '@ant-design/icons-angular';
import { antDesignIcons } from './shared/ant-design-icons.constants';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const icons: IconDefinition[] = [...antDesignIcons];
export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: NZ_ICONS, useValue: icons },
  ],
};
