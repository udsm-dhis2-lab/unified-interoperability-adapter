import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Workflow } from '../models/workflow.model';

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
};

export const workflowAdapter: EntityAdapter<Workflow> =
    createEntityAdapter<Workflow>();

export const initialWorkflowState =
    workflowAdapter.getInitialState(defaultWorkflow);
