import { createFeatureSelector, createSelector } from '@ngrx/store';
import { routerStateKey, scheduleFeatureKey } from './schedule.reducer';
import { scheduleAdapter, ScheduleState } from './schedule.state';

export const getScheduleFeature =
    createFeatureSelector<ScheduleState>(scheduleFeatureKey);

export const {
    selectEntities: getScheduleEntities,
    selectAll: getSchedules,
    selectIds: getScheduleIds,
    selectTotal: getSchedulesTotal,
} = scheduleAdapter.getSelectors(getScheduleFeature);

// export const getScheduleById = (id: string) => (getScheduleEntities as any)[id];

// export const getScheduleById = (id: string) => (getScheduleEntities as any)[id];

export const getAppRouterState = createFeatureSelector(routerStateKey);

export const getSchedulesLoadingStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.loading
);

export const getSchedulesLoadedStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.loaded
);

export const getScheduleLoadingStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.loadingSchedule
);

export const getScheduleLoadedStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.loadedSchedule
);

export const getAddingScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.addingSchedule
);

export const getAddedScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.addedSchedule
);

export const getUpdatingScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.updatingSchedule
);

export const getUpdatedScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.updatedSchedule
);

export const getDeletingScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.deletingSchedule
);

export const getDeletedScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.deletedSchedule
);

export const getScheduleHttpErrorResponse = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.httpErrorResponse
);

export const getPagerPageSize = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.pager.pageSize
);

export const getPagerPage = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.pager.page
);

export const getPagerTotal = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.pager.total
);

export const getEditedSchedule = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.editedSchedule
);

export const getCurrentSelectedSchedule = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.currentSelectedSchedule
);

export const getExecutedScheduleTask = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state.executedScheduleTask
);

export const getRunnedScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.runned
);

export const getRunningScheduleStatus = createSelector(
    getScheduleFeature,
    (state: ScheduleState) => state?.running
);
