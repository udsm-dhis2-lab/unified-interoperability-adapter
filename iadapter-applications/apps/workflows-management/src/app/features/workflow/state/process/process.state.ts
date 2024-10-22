import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Process } from '../../models/process.model';
import { Pager } from '../../models/pager.model';

export const pagerProcessInitialState: Pager = {
    page: 0,
    total: 0,
    pageSize: 12,
};

export interface ProcessState extends EntityState<Process> {
    loading: boolean;
    loaded: boolean;
    loadingProcess: boolean;
    loadedProcess: boolean;
    addingProcess: boolean;
    addedProcess: boolean;
    updatingProcess: boolean;
    updatedProcess: boolean;
    deletingProcess: boolean;
    deletedProcess: boolean;
    httpErrorResponse: HttpErrorResponse | null;
    editedProcess: Process | null;
    currentSelectedProcess: Process | null;
    currentProcessParentId: string | null;
    pager: Pager;
}

export const defaultProcess: ProcessState = {
    ids: [],
    entities: {},
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
    httpErrorResponse: null,
    editedProcess: null,
    currentSelectedProcess: null,
    currentProcessParentId: null,
    pager: pagerProcessInitialState,
};

export const processAdapter: EntityAdapter<Process> =
    createEntityAdapter<Process>();

export const initialProcessState =
    processAdapter.getInitialState(defaultProcess);
