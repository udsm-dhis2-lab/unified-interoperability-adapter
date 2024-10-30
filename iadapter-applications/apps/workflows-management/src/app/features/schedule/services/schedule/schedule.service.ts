import { Injectable } from '@angular/core';
import {
  DeleteResponse,
  Schedule,
  ScheduleAPIResult,
} from '../../models/schedule.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ScheduleEnum } from '../../enums/http-api.enum';
import { HduHttpService } from '../../../../../../../../libs/hdu-api-http-client/src';
import { ExecutedScheduleTask } from '../../models/runned.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  constructor(private hduHttpService: HduHttpService) {}

  /**
   * Fetches the workflows from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of WorkflowResult containing the API response
   */
  getExecutedScheduledTask(
    excutedScheduleTask: ExecutedScheduleTask
  ): Observable<ExecutedScheduleTask> {
    // Construct the full API URL safely
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_TASK_API}/${excutedScheduleTask.id}`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<ExecutedScheduleTask>(apiUrl).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetches the schedules from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of ScheduleResult containing the API response
   */
  getSchedules(page = 1, pageSize = 12): Observable<ScheduleAPIResult> {
    // Set up HTTP query parameters
    const params = new HttpParams()
      .set('fields', '*')
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Construct the full API URL safely
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_API}`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<ScheduleAPIResult>(apiUrl, { params }).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetch a single schedule by ID
   * @param id The ID of the schedule to fetch
   * @returns Observable of the schedule
   */
  getScheduleById(id: string): Observable<Schedule> {
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_API}/${id}?fields=*`;

    return this.hduHttpService
      .get<Schedule>(apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a new schedule
   * @param schedule The schedule object to be added
   * @returns Observable of the newly added schedule
   */
  addSchedule(schedule: Schedule): Observable<Schedule> {
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_API}`;

    return this.hduHttpService
      .post<Schedule>(apiUrl, schedule)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing schedule
   * @param id The ID of the schedule to update
   * @param schedule The schedule object with updated data
   * @returns Observable of the updated schedule
   */
  updateSchedule(id: string, schedule: Schedule): Observable<Schedule> {
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_API}/${id}`;

    return this.hduHttpService
      .put<Schedule>(apiUrl, schedule)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a schedule by ID
   * @param id The ID of the schedule to delete
   * @returns Observable<void> indicating the result of the deletion
   */
  deleteSchedule(id: string): Observable<DeleteResponse> {
    const apiUrl = `${ScheduleEnum.BASE_URL}${ScheduleEnum.SCHEDULE_API}/${id}`;

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
    console.error('Error fetching schedules:', httpErrorResponse);
    // Customize error handling based on the error status
    const errorMessage =
      httpErrorResponse.error?.message ||
      'Something went wrong, please try again.';
    return throwError(() => new Error(errorMessage));
  }
}
