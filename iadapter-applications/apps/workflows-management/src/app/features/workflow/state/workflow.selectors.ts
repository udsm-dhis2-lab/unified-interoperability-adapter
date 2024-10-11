import { createFeatureSelector, createSelector } from '@ngrx/store';
import { workflowFeatureKey } from './workflow.reducer';
import { workflowAdapter, WorkflowState } from './workflow.state';

export const getWorkflowFeature =
    createFeatureSelector<WorkflowState>(workflowFeatureKey);

export const {
    selectEntities: getWorkflowEntities,
    selectAll: getWorkflows,
    selectIds: getWorkflowIds,
    selectTotal: getWorkflowsTotal,
} = workflowAdapter.getSelectors(getWorkflowFeature);

// export const getWorkflowById = (id: string) => (getWorkflowEntities as any)[id];

export const getWorkflowsLoadingStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.loading
);

export const getWorkflowsLoadedStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.loaded
);

export const getWorkflowLoadingStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.loadingWorkflow
);

export const getWorkflowLoadedStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.loadedWorkflow
);

export const getAddingWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.addingWorkflow
);

export const getAddedWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.addedWorkflow
);

export const getUpdatingWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.updatingWorkflow
);

export const getUpdatedWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.updatedWorkflow
);

export const getDeletingWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.deletingWorkflow
);

export const getDeletedWorkflowStatus = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state?.deletedWorkflow
);

export const getWorkflowHttpErrorResponse = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state.httpErrorResponse
);

export const getPagerPageSize = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state.pager.pageSize
);

export const getPagerPage = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state.pager.page
);

export const getPagerTotal = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state.pager.total
);

export const getEditedWorkflow = createSelector(
    getWorkflowFeature,
    (state: WorkflowState) => state.editedWorkflow
);
