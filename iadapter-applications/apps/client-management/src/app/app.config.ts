import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { antDesignIcons } from './shared/ant-design-icons.constants';

const icons: IconDefinition[] = [...antDesignIcons];
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: NZ_ICONS, useValue: icons },
  ],
};
