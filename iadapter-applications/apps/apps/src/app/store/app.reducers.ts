import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import * as fromWorkflowManagement from '../../../../workflows-management/src/app/state/app.state';
export interface AppShellState {
  user: null;
  isAuthenticated: false;
  isAuthenticating: false;
  isInitialized: false;
  isMobile: false;
}

export const metaReducers: MetaReducer<AppShellState>[] = [];
