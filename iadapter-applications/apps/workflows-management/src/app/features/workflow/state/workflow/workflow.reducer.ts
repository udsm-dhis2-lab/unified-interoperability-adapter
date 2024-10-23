/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action, createReducer, on } from '@ngrx/store';
import { WorkflowActions } from './workflow.actions';

import { updateInitialWorkflowPagerState } from '../../helpers/state.helper';
import {
  initialWorkflowState,
  pagerWorkflowInitialState,
  workflowAdapter,
  WorkflowState,
} from './workflow.state';
import { searchProcessWithWorkflows } from '../../helpers/workflow.helper';

export const workflowFeatureKey = 'workflows';
export const routerStateKey = 'router';

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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
        currentSelectedWorkflow: workflow,
        runned: false,
        running: false,
        executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
      runned: false,
      running: false,
      executedWorkflow: null,
    };
  }),
  on(
    WorkflowActions.loadWorkflowSuccess,
    (state: WorkflowState, { workflow, process }) => {
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
        currentSelectedWorkflow: workflow,
        currentSelectedProcess: process,
        runned: false,
        running: false,
        executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
      pager: pagerWorkflowInitialState,
      editedWorkflow: null,
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
        currentSelectedWorkflow: null,
        runned: false,
        running: false,
        executedWorkflow: null,
        pager: updateInitialWorkflowPagerState(state.pager, workflowAPIResult),
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
      pager: pagerWorkflowInitialState,
      editedWorkflow: null,
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
      runned: false,
      running: false,
      executedWorkflow: null,
    };
  }),
  on(
    WorkflowActions.updateWorkflowSuccess,
    (state: WorkflowState, { workflow, updatedWorkflow }) => {
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
        currentSelectedWorkflow: updatedWorkflow,
        runned: false,
        running: false,
        executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
        currentSelectedWorkflow: null,
        runned: false,
        running: false,
        executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
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
      currentSelectedWorkflow: null,
      runned: false,
      running: false,
      executedWorkflow: null,
    })
  ),
  on(
    WorkflowActions.setCurrentSelectedWorkflow,
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
      editedWorkflow: null,
      currentSelectedWorkflow: workflow,
      runned: false,
      running: false,
      executedWorkflow: null,
    })
  ),
  on(
    WorkflowActions.setCurrentSelectedProcess,
    (state: WorkflowState, { id }) => {
      return {
        ...state,
        currentSelectedProcess: searchProcessWithWorkflows(state.entities, id),
      };
    }
  ),
  on(WorkflowActions.runWorkflow, (state: WorkflowState, { workflow }) => {
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
      currentSelectedWorkflow: null,
      runned: false,
      running: true,
      executedWorkflow: null,
    };
  }),
  on(
    WorkflowActions.runWorkflowSuccess,
    (state: WorkflowState, { executedWorkflow }) => {
      return {
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
        currentSelectedWorkflow: null,
        runned: false,
        running: false,
        executedWorkflow,
      };
    }
  ),
  on(
    WorkflowActions.updateCurrentSelectedWorkflow,
    (state: WorkflowState, { workflow, process }) => {
      return {
        ...state,
        currentSelectedWorkflow: workflow,
        currentSelectedProcess: process,
      };
    }
  ),
  on(
    WorkflowActions.setSelectedProcess,
    (state: WorkflowState, { process }) => {
      return {
        ...state,
        currentSelectedProcess: process,
      };
    }
  )
);

export function WorkflowReducer(
  state: WorkflowState | undefined,
  action: Action
) {
  return workflowReducer(state, action);
}
