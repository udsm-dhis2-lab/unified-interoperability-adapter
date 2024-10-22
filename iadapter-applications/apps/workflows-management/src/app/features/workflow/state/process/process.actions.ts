import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import {
  DeleteResponse,
  Process,
  ProcessAPIResult,
} from '../../models/process.model';

export const ProcessActions = createActionGroup({
  source: 'Process',
  events: {
    'Set Current Selected Process': props<{ process: Process }>(),
    'Set Edited Process': props<{ process: Process }>(),
    'Load Process': props<{ id: string }>(),
    'Load Process Success': props<{ process: Process }>(),
    'Load Process Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Processes': emptyProps(),
    'Load Processes Success': props<{ processAPIResult: ProcessAPIResult }>(),
    'Load Processes Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Add Process': props<{ process: Process }>(),
    'Add Process Success': props<{ process: Process }>(),
    'Add Process Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Update Process': props<{ process: Process }>(),
    'Update Process Success': props<{ process: Update<Process> }>(),
    'Update Process Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Delete Process': props<{ process: Process }>(),
    'Delete Process Success': props<{
      process: Process;
      deleteResponse: DeleteResponse;
    }>(),
    'Delete Process Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
  },
});
