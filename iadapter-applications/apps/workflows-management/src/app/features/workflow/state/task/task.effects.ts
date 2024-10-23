import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { Update } from '@ngrx/entity';
import { TaskService } from '../../services/task/task.service';
import { DeleteResponse, Task, TaskAPIResult } from '../../models/task.model';
import { TaskActions } from './task.actions';

Injectable();
export class TaskEffects {
  taskService = inject(TaskService);
  actions$ = inject(Actions);

  constructor() {
    // Contructor
  }

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      map((payload: { task: Task }) => payload),
      switchMap((payload: { task: Task }) =>
        this.taskService.addTask(payload.task).pipe(
          map((task: Task) => {
            return TaskActions.addTaskSuccess({
              task,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.addTaskFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  getCurrentRunningTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.getCurrentRunningTask),
      map((payload: { id: string }) => payload),
      switchMap((payload: { id: string }) => {
        return this.taskService.getCurrentRunningTask(payload.id).pipe(
          map((task: Task) => {
            return TaskActions.getCurrentRunningSuccess({
              task,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.getCurrentRunningFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() => {
        return this.taskService.getTasks().pipe(
          map((taskAPIResult: TaskAPIResult) => {
            return TaskActions.loadTasksSuccess({
              taskAPIResult,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.loadTasksFailure({ httpErrorResponse }))
          )
        );
      })
    )
  );

  getTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTask),
      map((payload: { id: string }) => payload),
      switchMap((payload: { id: string }) =>
        this.taskService.getTaskById(payload?.id).pipe(
          map((task: Task) => TaskActions.loadTaskSuccess({ task })),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.loadTaskFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      map((payload: { task: Task }) => payload),
      switchMap((payload: { task: Task }) =>
        this.taskService.updateTask(payload.task.id, payload.task).pipe(
          map((task: Task) => {
            const updatedTask: Update<Task> = {
              id: task.id,
              changes: task,
            };
            return TaskActions.updateTaskSuccess({
              task: updatedTask,
            });
          }),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.updateTaskFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      map((payload: { task: Task }) => payload),
      switchMap((payload: { task: Task }) =>
        this.taskService.deleteTask(payload.task.id).pipe(
          map((deleteResponse: DeleteResponse) =>
            TaskActions.deleteTaskSuccess({
              task: payload.task,
              deleteResponse,
            })
          ),
          catchError((httpErrorResponse: HttpErrorResponse) =>
            of(TaskActions.deleteTaskFailure({ httpErrorResponse }))
          )
        )
      )
    )
  );
}
