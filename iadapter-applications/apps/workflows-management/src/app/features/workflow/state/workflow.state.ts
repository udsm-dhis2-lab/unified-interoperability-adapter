import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Workflow } from '../models/workflow.model';
import { Pager } from '../models/pager.model';

export const pagerInitialState: Pager = {
    page: 0,
    total: 0,
    pageSize: 12,
}

export interface WorkflowState extends EntityState<Workflow> {
    loading: boolean;
    loaded: boolean;
    loadingWorkflow: boolean;
    loadedWorkflow: boolean;
    addingWorkflow: boolean;
    addedWorkflow: boolean;
    updatingWorkflow: boolean;
    updatedWorkflow: boolean;
    deletingWorkflow: boolean;
    deletedWorkflow: boolean;
    httpErrorResponse: HttpErrorResponse | null;
    editedWorkflow: Workflow | null,
    pager: Pager;
}

export const defaultWorkflow: WorkflowState = {
    ids: [],
    entities: {},
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
    httpErrorResponse: null,
    editedWorkflow: null,
    pager: pagerInitialState
};

export const workflowAdapter: EntityAdapter<Workflow> =
    createEntityAdapter<Workflow>();

export const initialWorkflowState =
    workflowAdapter.getInitialState(defaultWorkflow);
