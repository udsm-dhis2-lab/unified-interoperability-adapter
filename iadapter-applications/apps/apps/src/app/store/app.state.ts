/* eslint-disable no-constant-condition */
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import {
  initialWorkflowState,
  WorkflowState,
} from '../../../../workflows-management/src/app/state/app.state';
import { routerReducer } from '@ngrx/router-store';

import { RouterReducerState } from '@ngrx/router-store';
import { WorkflowEffects } from 'apps/workflows-management/src/app/features/workflow/state/workflow/workflow.effects';
import {
  WorkflowReducer,
  routerStateKey,
  workflowFeatureKey,
} from 'apps/workflows-management/src/app/features/workflow/state/workflow/workflow.reducer';
import {
  ProcessState,
  initialProcessState,
} from 'apps/workflows-management/src/app/features/workflow/state/process/process.state';
import {
  ProcessReducer,
  processFeatureKey,
} from 'apps/workflows-management/src/app/features/workflow/state/process/process.reducer';
import {
  ScheduleReducer,
  scheduleFeatureKey,
} from 'apps/workflows-management/src/app/features/schedule/state/schedule/schedule.reducer';
import {
  ScheduleState,
  initialScheduleState,
} from 'apps/workflows-management/src/app/features/schedule/state/schedule/schedule.state';
import {
  TaskState,
  initialTaskState,
} from 'apps/workflows-management/src/app/features/workflow/state/task/task.state';
import { RouterStateUrl } from 'apps/workflows-management/src/app/shared/models/router.model';
import {
  TaskReducer,
  taskFeatureKey,
} from 'apps/workflows-management/src/app/features/workflow/state/task/task.reducer';
import { initialRouterState } from 'apps/workflows-management/src/app/state/router.state';
import { ProcessEffects } from 'apps/workflows-management/src/app/features/workflow/state/process/process.effects';
import { TaskEffects } from 'apps/workflows-management/src/app/features/workflow/state/task/task.effects';
import { ScheduleEffects } from 'apps/workflows-management/src/app/features/schedule/state/schedule/schedule.effects';

export interface AppState {
  [workflowFeatureKey]: WorkflowState;
  [processFeatureKey]: ProcessState;
  [scheduleFeatureKey]: ScheduleState;
  [taskFeatureKey]: TaskState;
  [routerStateKey]: RouterReducerState<RouterStateUrl>;
}

export const initialAppState: AppState = {
  [workflowFeatureKey]: initialWorkflowState,
  [processFeatureKey]: initialProcessState,
  [scheduleFeatureKey]: initialScheduleState,
  [taskFeatureKey]: initialTaskState,
  [routerStateKey]: initialRouterState,
};

export const metaReducers: MetaReducer<AppState>[] = true ? [] : [];

export const appReducers: ActionReducerMap<AppState> = {
  [workflowFeatureKey]: WorkflowReducer,
  [processFeatureKey]: ProcessReducer,
  [scheduleFeatureKey]: ScheduleReducer,
  [taskFeatureKey]: TaskReducer,
  [routerStateKey]: routerReducer,
};

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<AppState>>(
  'App Reducers'
);

export const ReducerProvider = {
  provide: REDUCERS_TOKEN,
  useValue: appReducers,
};

export const appEffects = [
  WorkflowEffects,
  ProcessEffects,
  TaskEffects,
  ScheduleEffects,
];
