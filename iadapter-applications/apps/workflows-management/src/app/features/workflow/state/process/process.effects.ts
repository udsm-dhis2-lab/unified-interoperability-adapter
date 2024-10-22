import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { ProcessService } from '../../services/process/process.service';
import {
  DeleteResponse,
  Process,
  ProcessAPIResult,
} from '../../models/process.model';
import { ProcessActions } from './process.actions';

Injectable();
export class ProcessEffects {
  processService = inject(ProcessService);
  actions$ = inject(Actions);

  constructor() {
    // Contructor
  }

  createProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessActions.addProcess),
      map((payload: { process: Process }) => payload),
      switchMap((payload: { process: Process }) =>
        this.processService.addProcess(payload.process).pipe(
          map((process: Process) => {
            return ProcessActions.addProcessSuccess({
              process,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ProcessActions.addProcessFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  getProcesss$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessActions.loadProcesses),
      switchMap(() => {
        return this.processService.getProcesses().pipe(
          map((processAPIResult: ProcessAPIResult) => {
            return ProcessActions.loadProcessesSuccess({
              processAPIResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ProcessActions.loadProcessesFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessActions.loadProcess),
      map((payload: { id: string }) => payload),
      switchMap((payload: { id: string }) =>
        this.processService.getProcessById(payload?.id).pipe(
          map((process: Process) =>
            ProcessActions.loadProcessSuccess({ process })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ProcessActions.loadProcessFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  updateProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessActions.updateProcess),
      map((payload: { process: Process }) => payload),
      switchMap((payload: { process: Process }) =>
        this.processService
          .updateProcess(payload.process.id, payload.process)
          .pipe(
            map((process: Process) => {
              const updatedProcess: Update<Process> = {
                id: process.id,
                changes: process,
              };
              return ProcessActions.updateProcessSuccess({
                process: updatedProcess,
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) =>
              of(ProcessActions.updateProcessFailure({ httpErrorResponse }))
            )
          )
      )
    )
  );

  deleteProcess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProcessActions.deleteProcess),
      map((payload: { process: Process }) => payload),
      switchMap((payload: { process: Process }) =>
        this.processService.deleteProcess(payload.process.id).pipe(
          map((deleteResponse: DeleteResponse) =>
            ProcessActions.deleteProcessSuccess({
              process: payload.process,
              deleteResponse,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(ProcessActions.deleteProcessFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );
}
