import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { ScheduleService } from '../../services/schedule/schedule.service';
import {
  DeleteResponse,
  Schedule,
  ScheduleAPIResult,
} from '../../models/schedule.model';
import { ScheduleActions } from './schedule.actions';
import { ExecutedScheduleTask } from '../../models/runned.model';

Injectable();
export class ScheduleEffects {
  scheduleService = inject(ScheduleService);
  actions$ = inject(Actions);

  constructor() {
    // Contructor
  }

  getCurrentExecutedScheduleTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadCurrentScheduledTask),
      map((payload: { executedScheduleTask: ExecutedScheduleTask }) => payload),
      switchMap((payload: { executedScheduleTask: ExecutedScheduleTask }) => {
        return this.scheduleService
          .getExecutedScheduledTask(payload.executedScheduleTask)
          .pipe(
            map((executedScheduleTask: ExecutedScheduleTask) => {
              return ScheduleActions.loadCurrentScheduledTaskSuccess({
                executedScheduleTask: executedScheduleTask,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) =>
              of(
                ScheduleActions.loadCurrentScheduledTaskFailure({
                  httpErrorResponse,
                })
              )
            )
          );
      })
    )
  );

  createSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addSchedule),
      map((payload: { schedule: Schedule }) => payload),
      switchMap((payload: { schedule: Schedule }) =>
        this.scheduleService.addSchedule(payload.schedule).pipe(
          map((schedule: Schedule) => {
            return ScheduleActions.addScheduleSuccess({
              schedule,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ScheduleActions.addScheduleFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  getSchedules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadSchedules),
      switchMap(() => {
        return this.scheduleService.getSchedules().pipe(
          map((scheduleAPIResult: ScheduleAPIResult) => {
            return ScheduleActions.loadSchedulesSuccess({
              scheduleAPIResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ScheduleActions.loadSchedulesFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadSchedule),
      map((payload: { id: string }) => payload),
      switchMap((payload: { id: string }) =>
        this.scheduleService.getScheduleById(payload?.id).pipe(
          map((schedule: Schedule) =>
            ScheduleActions.loadScheduleSuccess({
              schedule,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ScheduleActions.loadScheduleFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  updateSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.updateSchedule),
      map((payload: { schedule: Schedule }) => payload),
      switchMap((payload: { schedule: Schedule }) =>
        this.scheduleService
          .updateSchedule(payload.schedule.id, payload.schedule)
          .pipe(
            map((schedule: Schedule) => {
              const updatedSchedule: Update<Schedule> = {
                id: schedule.id,
                changes: schedule,
              };
              return ScheduleActions.updateScheduleSuccess({
                schedule: updatedSchedule,
                updatedSchedule: schedule,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) =>
              of(ScheduleActions.updateScheduleFailure({ httpErrorResponse }))
            )
          )
      )
    )
  );

  deleteSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.deleteSchedule),
      map((payload: { schedule: Schedule }) => payload),
      switchMap((payload: { schedule: Schedule }) =>
        this.scheduleService.deleteSchedule(payload.schedule.id).pipe(
          map((deleteResponse: DeleteResponse) =>
            ScheduleActions.deleteScheduleSuccess({
              schedule: payload.schedule,
              deleteResponse,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ScheduleActions.deleteScheduleFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );
}
