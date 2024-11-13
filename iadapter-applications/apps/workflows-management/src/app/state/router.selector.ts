import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterReducerState } from '@ngrx/router-store';
import { routerStateKey } from '../features/workflow/state/workflow/workflow.reducer';
import { RouterStateUrl } from '../shared/models/router.model';


export const getAppRouterState =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>(routerStateKey);

export const getRouterState = createSelector(
  getAppRouterState,
  (router: RouterReducerState<RouterStateUrl>) => router.state
);

export const getCurrentUrl = createSelector(
  getRouterState,
  (routerState) => routerState.url
);

export const getRouteParams = createSelector(
  getRouterState,
  (routerState) => routerState.params
);

export const getQueryParams = createSelector(
  getRouterState,
  (routerState) => routerState.queryParams
);

export const getNavigationId = createSelector(
  getAppRouterState,
  (router: RouterReducerState<RouterStateUrl>) => router.navigationId
);

export const RouterSelectors = {
  getCurrentUrl,
  getRouteParams,
  getQueryParams,
  getNavigationId,
};
