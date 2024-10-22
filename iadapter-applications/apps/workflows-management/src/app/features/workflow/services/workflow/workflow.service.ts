import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  DeleteResponse,
  Workflow,
  WorkflowAPIResult,
} from '../../models/workflow.model';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HduHttpService } from '@iadapter-applications/hdu-api-http-client';
import { WorkflowEnum } from '../../enums/http-api.enum';
import { ExecutedWorkflow } from '../../models/runned.model';

@Injectable()
export class WorkflowService {
  constructor(private hduHttpService: HduHttpService) {}

  /**
   * Fetches the workflows from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of WorkflowResult containing the API response
   */
  runWorkflow(workflow: Workflow): Observable<ExecutedWorkflow> {
    // Construct the full API URL safely
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}/${workflow.id}/run`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<ExecutedWorkflow>(apiUrl).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetches the workflows from the API based on page and pageSize
   * @param page The page number to query (defaults to 1)
   * @param pageSize The number of records per page (defaults to 12)
   * @returns Observable of WorkflowResult containing the API response
   */
  getWorkflows(page = 1, pageSize = 12): Observable<WorkflowAPIResult> {
    // Set up HTTP query parameters
    const params = new HttpParams()
      .set(
        'fields',
        'id,created,updated,name,description,createdBy,updatedBy,process.children,process.children.children'
      )
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Construct the full API URL safely
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}`;

    // Make the GET request with the query parameters
    return this.hduHttpService.get<WorkflowAPIResult>(apiUrl, { params }).pipe(
      catchError(this.handleError) // Centralized error handling
    );
  }

  /**
   * Fetch a single workflow by ID
   * @param id The ID of the workflow to fetch
   * @returns Observable of the workflow
   */
  getWorkflowById(id: string): Observable<Workflow> {
    // Set up HTTP query parameters
    const params = new HttpParams().set(
      'fields',
      'id,created,updated,name,description,createdBy,updatedBy,process.children,process.children.children'
    );

    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}/${id}`;

    return this.hduHttpService
      .get<Workflow>(apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Add a new workflow
   * @param workflow The workflow object to be added
   * @returns Observable of the newly added workflow
   */
  addWorkflow(workflow: Workflow): Observable<Workflow> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}`;

    return this.hduHttpService
      .post<Workflow>(apiUrl, workflow)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing workflow
   * @param id The ID of the workflow to update
   * @param workflow The workflow object with updated data
   * @returns Observable of the updated workflow
   */
  updateWorkflow(id: string, workflow: Workflow): Observable<Workflow> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}/${id}`;

    return this.hduHttpService
      .put<Workflow>(apiUrl, workflow)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a workflow by ID
   * @param id The ID of the workflow to delete
   * @returns Observable<void> indicating the result of the deletion
   */
  deleteWorkflow(id: string): Observable<DeleteResponse> {
    const apiUrl = `${WorkflowEnum.BASE_URL}${WorkflowEnum.WORKFLOW_API}/${id}`;

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
    console.error('Error fetching workflows:', httpErrorResponse);
    // Customize error handling based on the error status
    const errorMessage =
      httpErrorResponse.error?.message ||
      'Something went wrong, please try again.';
    return throwError(() => new Error(errorMessage));
  }
}
