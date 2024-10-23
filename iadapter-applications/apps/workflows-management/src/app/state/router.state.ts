import { RouterStateUrl } from '../shared/models/router.model';

export const initialRouterState: CustomRouterState = {
    state: { url: '/', params: {}, queryParams: {} },
    navigationId: -1,
};

export interface CustomRouterState {
    state: RouterStateUrl;
    navigationId: number;
}
