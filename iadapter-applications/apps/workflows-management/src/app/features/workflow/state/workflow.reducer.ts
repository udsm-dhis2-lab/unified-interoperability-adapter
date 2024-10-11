/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action, createReducer, on } from '@ngrx/store';
import { WorkflowActions } from './workflow.actions';
import {
  initialWorkflowState,
  pagerInitialState,
  workflowAdapter,
  WorkflowState,
} from './workflow.state';
import { updateInitialPagerState } from '../helpers/state.helper';

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
      editedWorkflow: null,
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
        editedWorkflow: null,
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
      editedWorkflow: null,
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
      editedWorkflow: null,
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
        editedWorkflow: null,
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
      editedWorkflow: null,
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
      pager: pagerInitialState,
      editedWorkflow: null,
    };
  }),
  on(
    WorkflowActions.loadWorkflowsSuccess,
    (state: WorkflowState, { workflowAPIResult }) => {
      return workflowAdapter.upsertMany(workflowAPIResult.workflows, {
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
        editedWorkflow: null,
        pager: updateInitialPagerState(state.pager, workflowAPIResult),
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
      pager: pagerInitialState,
      editedWorkflow: null,
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
      editedWorkflow: null,
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
        editedWorkflow: null,
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
      editedWorkflow: null,
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
      editedWorkflow: null,
    };
  }),
  on(
    WorkflowActions.deleteWorkflowSuccess,
    (state: WorkflowState, { workflow }) => {
      return workflowAdapter.removeOne(workflow.id, {
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
        editedWorkflow: null,
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
      editedWorkflow: null,
    })
  ),
  on(
    WorkflowActions.setEditedWorkflow,
    (state: WorkflowState, { workflow }) => ({
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
      editedWorkflow: workflow,
    })
  )
);

export function WorkflowReducer(
  state: WorkflowState | undefined,
  action: Action
) {
  return workflowReducer(state, action);
}
