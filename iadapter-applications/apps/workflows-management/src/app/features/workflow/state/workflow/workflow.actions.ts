import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import {
  DeleteResponse,
  Workflow,
  WorkflowAPIResult,
} from '../../models/workflow.model';
import { ExecutedWorkflow } from '../../models/runned.model';
import { Process } from '../../models/process.model';

export const WorkflowActions = createActionGroup({
  source: 'Workflow',
  events: {
    'Run Workflow': props<{ workflow: Workflow }>(),
    'Run Workflow Success': props<{ executedWorkflow: ExecutedWorkflow }>(),
    'Run Workflow Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Update Current Selected Workflow': props<{
      workflow: Workflow;
      process: Process;
    }>(),
    'Set Current Selected Workflow': props<{ workflow: Workflow }>(),
    'Set Current Selected Process': props<{ id: string }>(),
    'Set Edited Workflow': props<{ workflow: Workflow }>(),
    'Get Get Current Selected Process': props<{ id: string }>(),
    'Load Workflow': props<{ id: string }>(),
    'Load Workflow Success': props<{ workflow: Workflow; process: Process }>(),
    'Load Workflow Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Workflows': emptyProps(),
    'Load Workflows Success': props<{ workflowAPIResult: WorkflowAPIResult }>(),
    'Load Workflows Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Add Workflow': props<{ workflow: Workflow }>(),
    'Add Workflow Success': props<{ workflow: Workflow }>(),
    'Add Workflow Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Update Workflow': props<{ workflow: Workflow }>(),
    'Update Workflow Success': props<{
      workflow: Update<Workflow>;
      updatedWorkflow: Workflow;
    }>(),
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
