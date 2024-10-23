import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { antDesignIcons } from './shared/config/ant-design-icons.constants';
import { appEffects, appReducers, metaReducers } from './state/app.state';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { WorkflowService } from './features/workflow/services/workflow/workflow.service';
import { provideEffects } from '@ngrx/effects';
import { TaskService } from './features/workflow/services/task/task.service';
import { ProcessService } from './features/workflow/services/process/process.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { LogMonitorModule } from 'ngx-log-monitor';
import { provideRouterStore } from '@ngrx/router-store';
import { ScheduleService } from './features/schedule/services/schedule/schedule.service';

registerLocaleData(en);
const icons: IconDefinition[] = [...antDesignIcons];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    importProvidersFrom(MonacoEditorModule),
    importProvidersFrom(LogMonitorModule),
    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideRouter(appRoutes),
    provideStore(appReducers, { metaReducers }),
    provideEffects(appEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAnimationsAsync(),
    provideRouterStore(),
    WorkflowService,
    TaskService,
    ProcessService,
    ScheduleService,
    { provide: NZ_ICONS, useValue: icons },
    { provide: NZ_I18N, useValue: en_US },
  ],
};
