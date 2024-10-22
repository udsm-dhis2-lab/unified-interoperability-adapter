import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import {
  DeleteResponse,
  Schedule,
  ScheduleAPIResult,
} from '../../models/schedule.model';
import { ExecutedScheduleTask } from '../../models/runned.model';

export const ScheduleActions = createActionGroup({
  source: 'Schedule',
  events: {
    'Update Current Selected Schedule': props<{
      Schedule: Schedule;
    }>(),
    'Set Current Selected Schedule': props<{ schedule: Schedule }>(),
    'Set Current Params': props<{
      scheduleParams: { [key: string]: string };
    }>(),
    'Set Current Schedule Form': props<{
      currentScheduleForm: { [key: string]: string };
    }>(),
    'Set Current Selected Process': props<{ id: string }>(),
    'Set Current Executed Schedule Task': props<{
      executedScheduleTask: ExecutedScheduleTask;
    }>(),
    'Set Edited Schedule': props<{ schedule: Schedule }>(),
    'Get Get Current Selected Process': props<{ id: string }>(),
    'Load Current Scheduled Task': props<{
      executedScheduleTask: ExecutedScheduleTask;
    }>(),
    'Load Current Scheduled Task Success': props<{
      executedScheduleTask: ExecutedScheduleTask;
    }>(),
    'Load Current Scheduled Task Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Load Schedule': props<{ id: string }>(),
    'Load Schedule Success': props<{ schedule: Schedule }>(),
    'Load Schedule Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Schedules': emptyProps(),
    'Load Schedules Success': props<{ scheduleAPIResult: ScheduleAPIResult }>(),
    'Load Schedules Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Add Schedule': props<{ schedule: Schedule }>(),
    'Add Schedule Success': props<{ schedule: Schedule }>(),
    'Add Schedule Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Update Schedule': props<{ schedule: Schedule }>(),
    'Update Schedule Success': props<{
      schedule: Update<Schedule>;
      updatedSchedule: Schedule;
    }>(),
    'Update Schedule Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Delete Schedule': props<{ schedule: Schedule }>(),
    'Delete Schedule Success': props<{
      schedule: Schedule;
      deleteResponse: DeleteResponse;
    }>(),
    'Delete Schedule Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
  },
});
