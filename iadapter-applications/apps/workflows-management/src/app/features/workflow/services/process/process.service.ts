import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HduHttpService } from '../../../../../../../../libs/hdu-api-http-client/src';
import { WorkflowEnum } from '../../enums/http-api.enum';
import {
  DeleteResponse,
  Process,
  ProcessAPIResult,
} from '../../models/process.model';

@Injectable()
export class ProcessService {
  constructor(private hduHttpService: HduHttpService) {}

  /**
   * Fetches the processs from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of ProcessResult containing the API response
   */
  getProcesses(page = 1, pageSize = 12): Observable<ProcessAPIResult> {
    // Set up HTTP query parameters
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Construct the full API URL safely
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.PROCESS_API}`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<ProcessAPIResult>(apiUrl, { params }).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetch a single process by ID
   * @param id The ID of the process to fetch
   * @returns Observable of the process
   */
  getProcessById(id: string): Observable<Process> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.PROCESS_API}/${id}`;

    return this.hduHttpService
      .get<Process>(apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a new process
   * @param process The process object to be added
   * @returns Observable of the newly added process
   */
  addProcess(process: Process): Observable<Process> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.PROCESS_API}`;

    return this.hduHttpService
      .post<Process>(apiUrl, process)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing process
   * @param id The ID of the process to update
   * @param process The process object with updated data
   * @returns Observable of the updated process
   */
  updateProcess(id: string, process: Process): Observable<Process> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.PROCESS_API}/${id}`;

    return this.hduHttpService
      .put<Process>(apiUrl, process)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a process by ID
   * @param id The ID of the process to delete
   * @returns Observable<void> indicating the result of the deletion
   */
  deleteProcess(id: string): Observable<DeleteResponse> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.PROCESS_API}/${id}`;

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
    console.error('Error fetching processs:', httpErrorResponse);
    // Customize error handling based on the error status
    const errorMessage =
      httpErrorResponse.error?.message ||
      'Something went wrong, please try again.';
    return throwError(() => new Error(errorMessage));
  }
}
