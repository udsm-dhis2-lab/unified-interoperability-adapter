import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Workflow, WorkflowFormCreate } from '../../models/workflow.model';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../state/workflow/workflow.state';
import {
  getAddedWorkflowStatus,
  getAddingWorkflowStatus,
  getCurrentSelectedWorkflow,
  getEditedWorkflow,
} from '../../state/workflow/workflow.selectors';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { WorkflowActions } from '../../state/workflow/workflow.actions';
import { Observable, skip, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    NzSpinModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit, AfterViewInit {
  workflowForm!: FormGroup;
  workflowUpdated!: Workflow;
  savingWorkflowStatus$!: Observable<boolean>;
  savedWorkflowStatus$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private workFlowState: Store<WorkflowState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.workFlowState
      .pipe(select(getEditedWorkflow), take(1))
      .subscribe((workflow: Workflow | null) => {
        if (workflow) {
          this.workflowUpdated = workflow;
          this.workflowForm.patchValue(workflow);
        }
      });
  }

  ngOnInit(): void {
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.savingWorkflowStatus$ = this.workFlowState.pipe(
      select(getAddingWorkflowStatus)
    );
    this.savedWorkflowStatus$ = this.workFlowState.pipe(
      select(getAddedWorkflowStatus)
    );
  }

  saveUpdateWorkflow(): WorkflowFormCreate | null {
    if (this.workflowForm.valid) {
      return {
        ...this.workflowUpdated,
        name: this.workflowForm.get('name')?.value,
        description: this.workflowForm.get('description')?.value,
      };
    } else {
      return null;
    }
  }

  onAddWorkflow() {
    if (this.workflowForm.valid) {
      this.workFlowState.dispatch(
        WorkflowActions.addWorkflow({ workflow: this.workflowForm.value })
      );

      this.workFlowState
        .pipe(select(getAddedWorkflowStatus), skip(1), take(1))
        .subscribe((status: boolean) => {
          if (status) {
            this.workflowForm.reset();
          }
        });

      this.workFlowState
        .pipe(select(getAddedWorkflowStatus), skip(1), take(1))
        .subscribe((status: boolean) => {
          if (status) {
            this.workFlowState
              .pipe(select(getCurrentSelectedWorkflow), take(1))
              .subscribe((workflow: Workflow | null) => {
                if (workflow && workflow.id) {
                  // this.router.navigate(['main/flow', `${workflow.id}`]);
                  this.router.navigate(['/', 'config', 'flow', `${workflow.id}`]);
                }
              });
          }
        });
    }
  }
}
