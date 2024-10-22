import { createFeatureSelector, createSelector } from '@ngrx/store';
import { processFeatureKey } from './process.reducer';
import { processAdapter, ProcessState } from './process.state';

export const getProcessFeature =
    createFeatureSelector<ProcessState>(processFeatureKey);

export const {
    selectEntities: getProcessEntities,
    selectAll: getProcesss,
    selectIds: getProcessIds,
    selectTotal: getProcesssTotal,
} = processAdapter.getSelectors(getProcessFeature);

// export const getProcessById = (id: string) => (getProcessEntities as any)[id];

export const getProcesssLoadingStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.loading
);

export const getProcesssLoadedStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.loaded
);

export const getProcessLoadingStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.loadingProcess
);

export const getProcessLoadedStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.loadedProcess
);

export const getAddingProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.addingProcess
);

export const getAddedProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.addedProcess
);

export const getUpdatingProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.updatingProcess
);

export const getUpdatedProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.updatedProcess
);

export const getDeletingProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.deletingProcess
);

export const getDeletedProcessStatus = createSelector(
    getProcessFeature,
    (state: ProcessState) => state?.deletedProcess
);

export const getProcessHttpErrorResponse = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.httpErrorResponse
);

export const getPagerPageSize = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.pager.pageSize
);

export const getPagerPage = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.pager.page
);

export const getPagerTotal = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.pager.total
);

export const getEditedProcess = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.editedProcess
);

export const getCurrentSelectedProcess = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.currentSelectedProcess
);

export const getCurrentProcessParentId = createSelector(
    getProcessFeature,
    (state: ProcessState) => state.currentProcessParentId
);
