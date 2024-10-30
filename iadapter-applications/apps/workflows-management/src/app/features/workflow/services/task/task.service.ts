import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HduHttpService } from '../../../../../../../../libs/hdu-api-http-client/src';
import { WorkflowEnum } from '../../enums/http-api.enum';
import { DeleteResponse, Task, TaskAPIResult } from '../../models/task.model';

@Injectable()
export class TaskService {
  constructor(private hduHttpService: HduHttpService) {}

  /**
   * Fetch a single task by ID
   * @param id The ID of the task to fetch
   * @returns Observable of the task
   */
  getCurrentRunningTask(id: string): Observable<Task> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}/${id}`;

    return this.hduHttpService
      .get<Task>(apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches the tasks from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of TaskResult containing the API response
   */
  getTasks(page = 1, pageSize = 12): Observable<TaskAPIResult> {
    // Set up HTTP query parameters
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Construct the full API URL safely
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<TaskAPIResult>(apiUrl, { params }).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetch a single task by ID
   * @param id The ID of the task to fetch
   * @returns Observable of the task
   */
  getTaskById(id: string): Observable<Task> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}/${id}`;

    return this.hduHttpService
      .get<Task>(apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a new task
   * @param task The task object to be added
   * @returns Observable of the newly added task
   */
  addTask(task: Task): Observable<Task> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}`;

    return this.hduHttpService
      .post<Task>(apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing task
   * @param id The ID of the task to update
   * @param task The task object with updated data
   * @returns Observable of the updated task
   */
  updateTask(id: string, task: Task): Observable<Task> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}/${id}`;

    return this.hduHttpService
      .put<Task>(apiUrl, task)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a task by ID
   * @param id The ID of the task to delete
   * @returns Observable<void> indicating the result of the deletion
   */
  deleteTask(id: string): Observable<DeleteResponse> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.TASK_API}/${id}`;

    return this.hduHttpService
      .delete<DeleteResponse>(apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors
   * @param httpErrorResponse The HTTP error response
   * @returns Observable that throws an error
   */
  private handleError(httpErrorResponse: HttpErrorResponse): Observable<never> {
    console.error('Error fetching tasks:', httpErrorResponse);
    // Customize error handling based on the error status
    const errorMessage =
      httpErrorResponse.error?.message ||
      'Something went wrong, please try again.';
    return throwError(() => new Error(errorMessage));
  }
}
