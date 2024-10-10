/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Workflow } from '../../models/workflow.model';
import { workFlowMockData } from '../mock/workflow.db';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  constructor() {}

  loadWorkflow(id: string): Observable<Workflow> {
    return of();
  }

  addWorkflow(workflow: Workflow): Observable<Workflow> {
    return of(workflow);
  }

  updateWorkflow(workflow: Workflow): Observable<Workflow> {
    return of(workflow);
  }

  deleteWorkflow(id: string): Observable<Workflow> {
    return of();
  }

  loadWorkflows(): Observable<Workflow[]> {
    return of([workFlowMockData]);
  }
}
