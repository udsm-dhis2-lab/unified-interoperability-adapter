import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Workflow } from '../../models/workflow.model';
import { Pager } from '../../models/pager.model';
import { ExecutedWorkflow } from '../../models/runned.model';
import { Process } from '../../models/process.model';

export const pagerWorkflowInitialState: Pager = {
    page: 0,
    total: 0,
    pageSize: 12,
};

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
    editedWorkflow: Workflow | null;
    currentSelectedWorkflow: Workflow | null;
    runned: boolean;
    running: boolean;
    executedWorkflow: ExecutedWorkflow | null;
    currentSelectedProcess: Process | null;
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
    currentSelectedWorkflow: null,
    runned: false,
    running: false,
    executedWorkflow: null,
    currentSelectedProcess: null,
    pager: pagerWorkflowInitialState,
};

export const workflowAdapter: EntityAdapter<Workflow> =
    createEntityAdapter<Workflow>();

export const initialWorkflowState =
    workflowAdapter.getInitialState(defaultWorkflow);
