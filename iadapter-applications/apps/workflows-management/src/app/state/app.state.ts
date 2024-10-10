/* eslint-disable no-constant-condition */
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import {
    workflowFeatureKey,
    WorkflowReducer,
} from '../pages/workflow/state/workflow.reducer';
import {
    initialWorkflowState,
    WorkflowState,
} from '../pages/workflow/state/workflow.state';
import { InjectionToken } from '@angular/core';
import { WorkflowEffects } from '../pages/workflow/state/workflow.effects';

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
