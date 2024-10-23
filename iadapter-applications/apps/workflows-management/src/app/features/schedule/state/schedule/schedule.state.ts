import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { HttpErrorResponse } from '@angular/common/http';
import { Schedule } from '../../models/schedule.model';
import { Pager } from '../../models/pager.model';
import { ExecutedScheduleTask } from '../../models/runned.model';

export const pagerScheduleInitialState: Pager = {
    page: 0,
    total: 0,
    pageSize: 12,
};

export interface ScheduleState extends EntityState<Schedule> {
    loadingCurrentTaskSchedule: boolean;
    loadedCurrentTaskSchedule: boolean;
    loading: boolean;
    loaded: boolean;
    loadingSchedule: boolean;
    loadedSchedule: boolean;
    addingSchedule: boolean;
    addedSchedule: boolean;
    updatingSchedule: boolean;
    updatedSchedule: boolean;
    deletingSchedule: boolean;
    deletedSchedule: boolean;
    httpErrorResponse: HttpErrorResponse | null;
    editedSchedule: Schedule | null;
    currentSelectedSchedule: Schedule | null;
    runned: boolean;
    running: boolean;
    executedScheduleTask: ExecutedScheduleTask | null;
    pager: Pager;
    scheduleParams: { [key: string]: string } | null;
    currentScheduleForm: { [key: string]: string } | null;
}

export const defaultSchedule: ScheduleState = {
    ids: [],
    entities: {},
    loading: false,
    loaded: false,
    loadingCurrentTaskSchedule: false,
    loadedCurrentTaskSchedule: false,
    loadingSchedule: false,
    loadedSchedule: false,
    addingSchedule: false,
    addedSchedule: false,
    updatingSchedule: false,
    updatedSchedule: false,
    deletingSchedule: false,
    deletedSchedule: false,
    httpErrorResponse: null,
    editedSchedule: null,
    currentSelectedSchedule: null,
    runned: false,
    running: false,
    executedScheduleTask: null,
    pager: pagerScheduleInitialState,
    scheduleParams: null,
    currentScheduleForm: null,
};

export const scheduleAdapter: EntityAdapter<Schedule> =
    createEntityAdapter<Schedule>();

export const initialScheduleState =
    scheduleAdapter.getInitialState(defaultSchedule);
