import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

// --- 1. Define the API endpoints for your validations ---
// Replace with your actual API endpoints
const BASE_URL = '/api/v1/validators';
export const ValidationUrls = {
  GET_VALIDATIONS: `${BASE_URL}`,
  CREATE_VALIDATION: `${BASE_URL}`,
  GET_VALIDATION_BY_ID: (id: string) => `${BASE_URL}/${id}`,
  UPDATE_VALIDATION: (id: string) => `${BASE_URL}/${id}`,
  DELETE_VALIDATION: (id: string) => `${BASE_URL}/${id}`,
};

// --- 2. Define the data models for a Validation ---

/**
 * Represents a single validation rule.
 * The structure should match the fields in your form.
 */
export interface Validation {
  uuid?: string; // The ID is optional, as it won't exist for a new rule
  name: string;
  description: string;
  errorMessage: string;
  code: string;
  ruleExpression: string;
}

/**
 * Represents a paginated response from the server when fetching a list of validations.
 * The structure (e.g., 'content', 'totalElements') should match your backend's pagination response.
 */
export interface ValidationPage {
  results: Validation[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}


@Injectable({
  providedIn: 'root' // Modern way to provide the service application-wide
})
export class ValidationService {
  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated and filtered list of validation rules.
   * @param pageIndex - The current page number (e.g., 0 for the first page).
   * @param pageSize - The number of items per page.
   * @param filters - An array of key-value pairs for filtering the results.
   * @returns An Observable of a ValidationPage.
   */
  getValidations(
    pageIndex: number,
    pageSize: number,
    filters: Array<{ key: string; value: string[] }>
  ): Observable<ValidationPage> {
    let params = new HttpParams();

    filters.forEach((filter) => {
      filter.value.forEach((value) => {
        params = params.append(filter.key, value);
      });
    });

    return this.http.get<ValidationPage>(ValidationUrls.GET_VALIDATIONS, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches a single validation rule by its unique ID.
   * @param id - The ID of the validation to fetch.
   * @returns An Observable of a single Validation.
   */
  getValidationById(id: string): Observable<Validation> {
    return this.http.get<Validation>(ValidationUrls.GET_VALIDATION_BY_ID(id))
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new validation rule on the server.
   * @param validationData - The validation object, typically from a form.
   * @returns An Observable of the created Validation (with its new ID).
   */
  createValidation(validationData: Validation): Observable<Validation> {
    return this.http.post<Validation>(ValidationUrls.CREATE_VALIDATION, validationData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing validation rule on the server.
   * @param id - The ID of the validation to update.
   * @param validationData - The updated validation data.
   * @returns An Observable of the updated Validation.
   */
  updateValidation(id: string, validationData: Validation): Observable<Validation> {
    return this.http.put<Validation>(ValidationUrls.UPDATE_VALIDATION(id), validationData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a validation rule from the server.
   * @param id - The ID of the validation to delete.
   * @returns An Observable<void> as there is no response body on success.
   */
  deleteValidation(id: string): Observable<void> {
    return this.http.delete<void>(ValidationUrls.DELETE_VALIDATION(id))
      .pipe(catchError(this.handleError));
  }

  /**
   * A centralized error handler for HTTP requests.
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.status === 401) {
      errorMessage = 'Unauthorized. Please check your credentials.';
    } else if (error.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.error && error.error.message) {
      // Use the server's error message if available
      errorMessage = error.error.message;
    }
    // In a real app, you might use a remote logging infrastructure
    console.error(error);
    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }
}
