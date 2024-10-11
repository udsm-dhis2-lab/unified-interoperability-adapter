/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action, createReducer, on } from '@ngrx/store';
import { WorkflowActions } from './workflow.actions';
import {
  initialWorkflowState,
  workflowAdapter,
  WorkflowState,
} from './workflow.state';

export const workflowFeatureKey = 'workflows';

const workflowReducer = createReducer(
  initialWorkflowState,
  on(WorkflowActions.addWorkflow, (state: WorkflowState, { workflow }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: true,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse: null,
    };
  }),
  on(
    WorkflowActions.addWorkflowSuccess,
    (state: WorkflowState, { workflow }) => {
      return workflowAdapter.upsertOne(workflow, {
        ...state,
        loading: false,
        loaded: false,
        loadingWorkflow: false,
        loadedWorkflow: false,
        addingWorkflow: false,
        addedWorkflow: true,
        updatingWorkflow: false,
        updatedWorkflow: false,
        deletingWorkflow: false,
        deletedWorkflow: false,
        httpErrorResponse: null,
      });
    }
  ),
  on(
    WorkflowActions.addWorkflowFailure,
    (state: WorkflowState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse,
    })
  ),
  on(WorkflowActions.loadWorkflow, (state: WorkflowState) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: true,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse: null,
    };
  }),
  on(
    WorkflowActions.loadWorkflowSuccess,
    (state: WorkflowState, { workflow }) => {
      return workflowAdapter.upsertOne(workflow, {
        ...state,
        loading: false,
        loaded: false,
        loadingWorkflow: false,
        loadedWorkflow: true,
        addingWorkflow: false,
        addedWorkflow: false,
        updatingWorkflow: false,
        updatedWorkflow: false,
        deletingWorkflow: false,
        deletedWorkflow: false,
        httpErrorResponse: null,
      });
    }
  ),
  on(
    WorkflowActions.loadWorkflowFailure,
    (state: WorkflowState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse,
    })
  ),
  on(WorkflowActions.loadWorkflows, (state: WorkflowState) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse: null,
    };
  }),
  on(
    WorkflowActions.loadWorkflowsSuccess,
    (state: WorkflowState, { workflows }) => {
      return workflowAdapter.upsertMany(workflows, {
        ...state,
        loading: false,
        loaded: true,
        loadingWorkflow: false,
        loadedWorkflow: false,
        addingWorkflow: false,
        addedWorkflow: false,
        updatingWorkflow: false,
        updatedWorkflow: false,
        deletingWorkflow: false,
        deletedWorkflow: false,
        httpErrorResponse: null,
      });
    }
  ),
  on(
    WorkflowActions.loadWorkflowsFailure,
    (state: WorkflowState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse,
    })
  ),
  on(WorkflowActions.updateWorkflow, (state: WorkflowState, { workflow }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: true,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse: null,
    };
  }),
  on(
    WorkflowActions.updateWorkflowSuccess,
    (state: WorkflowState, { workflow }) => {
      return workflowAdapter.updateOne(workflow, {
        ...state,
        loading: false,
        loaded: false,
        loadingWorkflow: false,
        loadedWorkflow: false,
        addingWorkflow: false,
        addedWorkflow: false,
        updatingWorkflow: false,
        updatedWorkflow: true,
        deletingWorkflow: false,
        deletedWorkflow: false,
        httpErrorResponse: null,
      });
    }
  ),
  on(
    WorkflowActions.updateWorkflowFailure,
    (state: WorkflowState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse,
    })
  ),
  on(WorkflowActions.deleteWorkflow, (state: WorkflowState, { workflow }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: true,
      deletedWorkflow: false,
      httpErrorResponse: null,
    };
  }),
  on(
    WorkflowActions.deleteWorkflowSuccess,
    (state: WorkflowState, { workflow }) => {
      return workflowAdapter.removeOne(workflow.root.id, {
        ...state,
        loading: false,
        loaded: false,
        loadingWorkflow: false,
        loadedWorkflow: false,
        addingWorkflow: false,
        addedWorkflow: false,
        updatingWorkflow: false,
        updatedWorkflow: false,
        deletingWorkflow: false,
        deletedWorkflow: true,
        httpErrorResponse: null,
      });
    }
  ),
  on(
    WorkflowActions.deleteWorkflowFailure,
    (state: WorkflowState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingWorkflow: false,
      loadedWorkflow: false,
      addingWorkflow: false,
      addedWorkflow: false,
      updatingWorkflow: false,
      updatedWorkflow: false,
      deletingWorkflow: false,
      deletedWorkflow: false,
      httpErrorResponse,
    })
  )
);

export function WorkflowReducer(
  state: WorkflowState | undefined,
  action: Action
) {
  return workflowReducer(state, action);
}
