import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { Pager } from '../../models/pager.model';

export const pagerTaskInitialState: Pager = {
    page: 0,
    total: 0,
    pageSize: 12,
};

export interface TaskState extends EntityState<Task> {
    loading: boolean;
    loaded: boolean;
    loadingTask: boolean;
    loadedTask: boolean;
    addingTask: boolean;
    addedTask: boolean;
    updatingTask: boolean;
    updatedTask: boolean;
    deletingTask: boolean;
    deletedTask: boolean;
    httpErrorResponse: HttpErrorResponse | null;
    editedTask: Task | null;
    runningTask: boolean;
    runnedTask: boolean;
    currentRunningTask: Task | null;
    currentSelectedTask: Task | null;
    pager: Pager;
}

export const defaultTask: TaskState = {
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
    loadingTask: false,
    loadedTask: false,
    addingTask: false,
    addedTask: false,
    updatingTask: false,
    updatedTask: false,
    deletingTask: false,
    deletedTask: false,
    httpErrorResponse: null,
    editedTask: null,
    currentSelectedTask: null,
    runningTask: false,
    runnedTask: false,
    currentRunningTask: null,
    pager: pagerTaskInitialState,
};

export const taskAdapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export const initialTaskState = taskAdapter.getInitialState(defaultTask);
