import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import {
  DeleteResponse,
  Workflow,
  WorkflowAPIResult,
} from '../models/workflow.model';

export const WorkflowActions = createActionGroup({
  source: 'Workflow',
  events: {
    'Load Workflow': props<{ id: string }>(),
    'Load Workflow Success': props<{ workflow: Workflow }>(),
    'Load Workflow Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Workflows': emptyProps(),
    'Load Workflows Success': props<{ workflowAPIResult: WorkflowAPIResult }>(),
    'Load Workflows Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Add Workflow': props<{ workflow: Workflow }>(),
    'Add Workflow Success': props<{ workflow: Workflow }>(),
    'Add Workflow Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Update Workflow': props<{ workflow: Workflow}>(),
    'Update Workflow Success': props<{ workflow: Update<Workflow> }>(),
    'Update Workflow Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Delete Workflow': props<{ workflow: Workflow }>(),
    'Delete Workflow Success': props<{
      workflow: Workflow;
      deleteResponse: DeleteResponse;
    }>(),
    'Delete Workflow Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
  },
});
