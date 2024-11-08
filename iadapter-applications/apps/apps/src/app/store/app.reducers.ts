import { MetaReducer } from '@ngrx/store';
export interface AppShellState {
  user: null;
  isAuthenticated: false;
  isAuthenticating: false;
  isInitialized: false;
  isMobile: false;
}

export const metaReducers: MetaReducer<AppShellState>[] = [];
