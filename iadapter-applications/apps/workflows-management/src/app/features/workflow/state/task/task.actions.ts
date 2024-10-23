import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { DeleteResponse, Task, TaskAPIResult } from '../../models/task.model';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    'Set Current Selected Task': props<{ task: Task }>(),
    'Set Edited Task': props<{ task: Task }>(),
    'Get Current Running Task': props<{ id: string }>(),
    'Get Current Running Success': props<{ task: Task }>(),
    'Get Current Running Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Task': props<{ id: string }>(),
    'Load Task Success': props<{ task: Task }>(),
    'Load Task Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ taskAPIResult: TaskAPIResult }>(),
    'Load Tasks Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Add Task': props<{ task: Task }>(),
    'Add Task Success': props<{ task: Task }>(),
    'Add Task Failure': props<{ httpErrorResponse: HttpErrorResponse }>(),
    'Update Task': props<{ task: Task }>(),
    'Update Task Success': props<{ task: Update<Task> }>(),
    'Update Task Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
    'Delete Task': props<{ task: Task }>(),
    'Delete Task Success': props<{
      task: Task;
      deleteResponse: DeleteResponse;
    }>(),
    'Delete Task Failure': props<{
      httpErrorResponse: HttpErrorResponse;
    }>(),
  },
});
