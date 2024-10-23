import { createFeatureSelector, createSelector } from '@ngrx/store';
import { taskAdapter, TaskState } from './task.state';
import { taskFeatureKey } from './task.reducer';

export const getTaskFeature = createFeatureSelector<TaskState>(taskFeatureKey);

export const {
    selectEntities: getTaskEntities,
    selectAll: getTasks,
    selectIds: getTaskIds,
    selectTotal: getTasksTotal,
} = taskAdapter.getSelectors(getTaskFeature);

// export const getTaskById = (id: string) => (getTaskEntities as any)[id];

export const getTasksLoadingStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.loading
);

export const getTasksLoadedStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.loaded
);

export const getTaskLoadingStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.loadingTask
);

export const getTaskLoadedStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.loadedTask
);

export const getAddingTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.addingTask
);

export const getAddedTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.addedTask
);

export const getUpdatingTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.updatingTask
);

export const getUpdatedTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.updatedTask
);

export const getDeletingTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.deletingTask
);

export const getDeletedTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.deletedTask
);

export const getTaskHttpErrorResponse = createSelector(
    getTaskFeature,
    (state: TaskState) => state.httpErrorResponse
);

export const getPagerPageSize = createSelector(
    getTaskFeature,
    (state: TaskState) => state.pager.pageSize
);

export const getPagerPage = createSelector(
    getTaskFeature,
    (state: TaskState) => state.pager.page
);

export const getPagerTotal = createSelector(
    getTaskFeature,
    (state: TaskState) => state.pager.total
);

export const getEditedTask = createSelector(
    getTaskFeature,
    (state: TaskState) => state.editedTask
);

export const getCurrentSelectedTask = createSelector(
    getTaskFeature,
    (state: TaskState) => state.currentSelectedTask
);

export const getCurrentRunningTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.runningTask
);

export const getCurrentRunnedTaskStatus = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.runnedTask
);

export const getCurrentRunningTask = createSelector(
    getTaskFeature,
    (state: TaskState) => state?.currentRunningTask
);
