/* eslint-disable no-constant-condition */
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { WorkflowEffects } from '../features/workflow/state/workflow/workflow.effects';
import {
    initialWorkflowState,
    WorkflowState,
} from '../features/workflow/state/workflow/workflow.state';
import {
    routerStateKey,
    workflowFeatureKey,
    WorkflowReducer,
} from '../features/workflow/state/workflow/workflow.reducer';
import {
    processFeatureKey,
    ProcessReducer,
} from '../features/workflow/state/process/process.reducer';
import {
    initialProcessState,
    ProcessState,
} from '../features/workflow/state/process/process.state';
import { ProcessEffects } from '../features/workflow/state/process/process.effects';
import {
    taskFeatureKey,
    TaskReducer,
} from '../features/workflow/state/task/task.reducer';
import {
    initialTaskState,
    TaskState,
} from '../features/workflow/state/task/task.state';
import { TaskEffects } from '../features/workflow/state/task/task.effects';
import { routerReducer } from '@ngrx/router-store';

import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from '../shared/models/router.model';
import { initialRouterState } from './router.state';
import {
    scheduleFeatureKey,
    ScheduleReducer,
} from '../features/schedule/state/schedule/schedule.reducer';
import {
    initialScheduleState,
    ScheduleState,
} from '../features/schedule/state/schedule/schedule.state';
import { ScheduleEffects } from '../features/schedule/state/schedule/schedule.effects';

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
