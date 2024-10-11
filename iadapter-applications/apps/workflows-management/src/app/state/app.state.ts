/* eslint-disable no-constant-condition */
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken } from '@angular/core';
import { WorkflowEffects } from '../features/workflow/state/workflow.effects';
import {
    initialWorkflowState,
    WorkflowState,
} from '../features/workflow/state/workflow.state';
import {
    workflowFeatureKey,
    WorkflowReducer,
} from '../features/workflow/state/workflow.reducer';

export interface AppState {
    [workflowFeatureKey]: WorkflowState;
}

export const initialAppState: AppState = {
    [workflowFeatureKey]: initialWorkflowState,
};

export const metaReducers: MetaReducer<AppState>[] = true ? [] : [];

export const appReducers: ActionReducerMap<AppState> = {
    [workflowFeatureKey]: WorkflowReducer,
};

export const REDUCERS_TOKEN = new InjectionToken<ActionReducerMap<AppState>>(
    'App Reducers'
);

export const ReducerProvider = {
    provide: REDUCERS_TOKEN,
    useValue: appReducers,
};

export const appEffects = [WorkflowEffects];
