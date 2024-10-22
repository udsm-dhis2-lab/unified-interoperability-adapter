import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { WorkflowService } from '../../services/workflow/workflow.service';
import {
  DeleteResponse,
  Workflow,
  WorkflowAPIResult,
} from '../../models/workflow.model';
import { WorkflowActions } from './workflow.actions';
import { ExecutedWorkflow } from '../../models/runned.model';
import { Process } from '../../models/process.model';

Injectable();
export class WorkflowEffects {
  workflowService = inject(WorkflowService);
  actions$ = inject(Actions);

  constructor() {
    // Contructor
  }

  createWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.addWorkflow),
      map((payload: { workflow: Workflow }) => payload),
      switchMap((payload: { workflow: Workflow }) =>
        this.workflowService.addWorkflow(payload.workflow).pipe(
          map((workflow: Workflow) => {
            return WorkflowActions.addWorkflowSuccess({
              workflow,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(WorkflowActions.addWorkflowFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  runWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.runWorkflow),
      map((payload: { workflow: Workflow }) => payload),
      switchMap((payload: { workflow: Workflow }) => {
        return this.workflowService.runWorkflow(payload.workflow).pipe(
          map((executedWorkflow: ExecutedWorkflow) => {
            return WorkflowActions.runWorkflowSuccess({
              executedWorkflow,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(WorkflowActions.runWorkflowFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getWorkflows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.loadWorkflows),
      switchMap(() => {
        return this.workflowService.getWorkflows().pipe(
          map((workflowAPIResult: WorkflowAPIResult) => {
            return WorkflowActions.loadWorkflowsSuccess({
              workflowAPIResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(WorkflowActions.loadWorkflowsFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.loadWorkflow),
      map((payload: { id: string }) => payload),
      switchMap((payload: { id: string }) =>
        this.workflowService.getWorkflowById(payload?.id).pipe(
          map((workflow: Workflow) =>
            WorkflowActions.loadWorkflowSuccess({
              workflow,
              process: workflow.process as Process,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(WorkflowActions.loadWorkflowFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  updateWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.updateWorkflow),
      map((payload: { workflow: Workflow }) => payload),
      switchMap((payload: { workflow: Workflow }) =>
        this.workflowService
          .updateWorkflow(payload.workflow.id, payload.workflow)
          .pipe(
            map((workflow: Workflow) => {
              const updatedWorkflow: Update<Workflow> = {
                id: workflow.id,
                changes: {
                  ...workflow,
                },
              };
              return WorkflowActions.updateWorkflowSuccess({
                workflow: updatedWorkflow,
                updatedWorkflow: {
                  ...workflow
                },
              });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) =>
              of(WorkflowActions.updateWorkflowFailure({ httpErrorResponse }))
            )
          )
      )
    )
  );

  deleteWorkflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.deleteWorkflow),
      map((payload: { workflow: Workflow }) => payload),
      switchMap((payload: { workflow: Workflow }) =>
        this.workflowService.deleteWorkflow(payload.workflow.id).pipe(
          map((deleteResponse: DeleteResponse) =>
            WorkflowActions.deleteWorkflowSuccess({
              workflow: payload.workflow,
              deleteResponse,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(WorkflowActions.deleteWorkflowFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );
}
