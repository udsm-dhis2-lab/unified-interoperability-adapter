/* eslint-disable @typescript-eslint/no-unused-vars */
import { Action, createReducer, on } from '@ngrx/store';
import { ProcessActions } from './process.actions';
import {
  updateInitialProcessPagerState,
  updateInitialWorkflowPagerState,
} from '../../helpers/state.helper';
import {
  initialProcessState,
  pagerProcessInitialState,
  processAdapter,
  ProcessState,
} from './process.state';

export const processFeatureKey = 'processs';

const processReducer = createReducer(
  initialProcessState,
  on(ProcessActions.addProcess, (state: ProcessState, { process }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: true,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: null,
    };
  }),
  on(ProcessActions.addProcessSuccess, (state: ProcessState, { process }) => {
    return processAdapter.upsertOne(process, {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: true,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: process,
    });
  }),
  on(
    ProcessActions.addProcessFailure,
    (state: ProcessState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse,
      editedProcess: null,
      currentSelectedProcess: null,
    })
  ),
  on(ProcessActions.loadProcess, (state: ProcessState) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: true,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: null,
    };
  }),
  on(ProcessActions.loadProcessSuccess, (state: ProcessState, { process }) => {
    return processAdapter.upsertOne(process, {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: true,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: null,
    });
  }),
  on(
    ProcessActions.loadProcessFailure,
    (state: ProcessState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse,
      editedProcess: null,
      currentSelectedProcess: null,
    })
  ),
  on(ProcessActions.loadProcesses, (state: ProcessState) => {
    return {
      ...state,
      loading: true,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      pager: pagerProcessInitialState,
      editedProcess: null,
      currentSelectedProcess: null,
    };
  }),
  on(
    ProcessActions.loadProcessesSuccess,
    (state: ProcessState, { processAPIResult }) => {
      return processAdapter.upsertMany(processAPIResult.processs, {
        ...state,
        loading: false,
        loaded: true,
        loadingProcess: false,
        loadedProcess: false,
        addingProcess: false,
        addedProcess: false,
        updatingProcess: false,
        updatedProcess: false,
        deletingProcess: false,
        deletedProcess: false,
        httpErrorResponse: null,
        editedProcess: null,
        currentSelectedProcess: null,
        pager: updateInitialProcessPagerState(state.pager, processAPIResult),
      });
    }
  ),
  on(
    ProcessActions.loadProcessesFailure,
    (state: ProcessState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse,
      pager: pagerProcessInitialState,
      editedProcess: null,
      currentSelectedProcess: null,
    })
  ),
  on(ProcessActions.updateProcess, (state: ProcessState, { process }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: true,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: null,
    };
  }),
  on(
    ProcessActions.updateProcessSuccess,
    (state: ProcessState, { process }) => {
      return processAdapter.updateOne(process, {
        ...state,
        loading: false,
        loaded: false,
        loadingProcess: false,
        loadedProcess: false,
        addingProcess: false,
        addedProcess: false,
        updatingProcess: false,
        updatedProcess: true,
        deletingProcess: false,
        deletedProcess: false,
        httpErrorResponse: null,
        editedProcess: null,
        currentSelectedProcess: null,
      });
    }
  ),
  on(
    ProcessActions.updateProcessFailure,
    (state: ProcessState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse,
      editedProcess: null,
      currentSelectedProcess: null,
    })
  ),
  on(ProcessActions.deleteProcess, (state: ProcessState, { process }) => {
    return {
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: true,
      deletedProcess: false,
      httpErrorResponse: null,
      editedProcess: null,
      currentSelectedProcess: null,
    };
  }),
  on(
    ProcessActions.deleteProcessSuccess,
    (state: ProcessState, { process }) => {
      return processAdapter.removeOne(process.id, {
        ...state,
        loading: false,
        loaded: false,
        loadingProcess: false,
        loadedProcess: false,
        addingProcess: false,
        addedProcess: false,
        updatingProcess: false,
        updatedProcess: false,
        deletingProcess: false,
        deletedProcess: true,
        httpErrorResponse: null,
        editedProcess: null,
        currentSelectedProcess: null,
      });
    }
  ),
  on(
    ProcessActions.deleteProcessFailure,
    (state: ProcessState, { httpErrorResponse }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      httpErrorResponse,
      editedProcess: null,
      currentSelectedProcess: null,
    })
  ),
  on(ProcessActions.setEditedProcess, (state: ProcessState, { process }) => ({
    ...state,
    loading: false,
    loaded: false,
    loadingProcess: false,
    loadedProcess: false,
    addingProcess: false,
    addedProcess: false,
    updatingProcess: false,
    updatedProcess: false,
    deletingProcess: false,
    deletedProcess: false,
    editedProcess: process,
    currentSelectedProcess: null,
  })),
  on(
    ProcessActions.setCurrentSelectedProcess,
    (state: ProcessState, { process }) => ({
      ...state,
      loading: false,
      loaded: false,
      loadingProcess: false,
      loadedProcess: false,
      addingProcess: false,
      addedProcess: false,
      updatingProcess: false,
      updatedProcess: false,
      deletingProcess: false,
      deletedProcess: false,
      editedProcess: null,
      currentSelectedProcess: process,
    })
  )
);

export function ProcessReducer(
  state: ProcessState | undefined,
  action: Action
) {
  return processReducer(state, action);
}
