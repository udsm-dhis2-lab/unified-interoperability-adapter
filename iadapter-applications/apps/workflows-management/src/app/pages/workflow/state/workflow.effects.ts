/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { WorkflowService } from '../services/workflow/workflow.service';
import { WorkflowActions } from './workflow.actions';
import { Workflow } from '../models/workflow.model';

Injectable();
export class WorkflowEffects {
  constructor(
    private actions$: Actions,
    private workflowService: WorkflowService
  ) {}

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

  getWorkflows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkflowActions.loadWorkflows),
      switchMap(() => {
        return this.workflowService.loadWorkflows().pipe(
          map((workflows: Workflow[]) =>
            WorkflowActions.loadWorkflowsSuccess({ workflows })
          ),
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
        this.workflowService.loadWorkflow(payload?.id).pipe(
          map((workflow: Workflow) =>
            WorkflowActions.loadWorkflowSuccess({ workflow })
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
      map((payload: any) => payload),
      switchMap((payload: { workflow: Workflow }) =>
        this.workflowService.updateWorkflow(payload.workflow).pipe(
          map((workflow: Workflow) => {
            const updatedWorkflow: Update<Workflow> = {
              id: workflow.root.id,
              changes: workflow,
            };
            return WorkflowActions.updateWorkflowSuccess({
              workflow: updatedWorkflow,
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
        this.workflowService.deleteWorkflow(payload.workflow.root.id).pipe(
          map((workflow: Workflow) =>
            WorkflowActions.deleteWorkflow({
              workflow,
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
