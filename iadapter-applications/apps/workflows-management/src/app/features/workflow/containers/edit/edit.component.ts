import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Workflow, WorkflowFormCreate } from '../../models/workflow.model';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { select, Store } from '@ngrx/store';
import {
  getCurrentSelectedWorkflow,
  getEditedWorkflow,
  getUpdatedWorkflowStatus,
  getUpdatingWorkflowStatus,
} from '../../state/workflow/workflow.selectors';
import { Observable, skip, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowActions } from '../../state/workflow/workflow.actions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { filterPayload } from '../../helpers/workflow.helper';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    ReactiveFormsModule,
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    NzSpinModule,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent implements OnInit, AfterViewInit {
  workflowForm!: FormGroup;
  workflowUpdated!: Workflow;
  updatingWorkflowStatus$!: Observable<boolean>;
  updatedWorkflowStatus$!: Observable<boolean>;

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

    this.workFlowState
      .pipe(select(getCurrentSelectedWorkflow, take(1)))
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

    this.updatingWorkflowStatus$ = this.workFlowState.pipe(
      select(getUpdatingWorkflowStatus)
    );
    this.updatedWorkflowStatus$ = this.workFlowState.pipe(
      select(getUpdatedWorkflowStatus)
    );
  }

  saveUpdateWorkflow() {
    if (this.workflowForm.valid) {
      this.workFlowState
        .pipe(select(getCurrentSelectedWorkflow), take(1))
        .subscribe((workflow: Workflow | null) => {
          if (workflow) {
            this.workFlowState.dispatch(
              WorkflowActions.updateWorkflow({
                workflow: {
                  // ...omit(workflow, ['process']),
                  id: workflow.id,
                  name: this.workflowForm.get('name')?.value,
                  description: this.workflowForm.get('description')?.value,
                } as Workflow,
              })
            );
          }
        });

      this.workFlowState
        .pipe(select(getUpdatedWorkflowStatus), skip(1), take(1))
        .subscribe((status: boolean) => {
          if (status) {
            this.workflowForm.reset();
          }
        });

      this.workFlowState
        .pipe(select(getUpdatedWorkflowStatus), skip(1), take(1))
        .subscribe((status: boolean) => {
          if (status) {
            this.workFlowState
              .pipe(select(getCurrentSelectedWorkflow), take(1))
              .subscribe((workflow: Workflow | null) => {
                if (workflow && workflow.id) {
                  this.router.navigate([
                    '/',
                    'workflows-management',
                    'config',
                    'flow',
                    `${workflow.id}`,
                  ]);
                }
              });
          }
        });
    }
  }

  // workflowForm!: FormGroup;
  // workflowUpdated!: Workflow;

  // constructor(
  //   private fb: FormBuilder,
  //   private workFlowState: Store<WorkflowState>
  // ) {}

  // ngAfterViewInit(): void {
  //   this.workFlowState
  //     .pipe(select(getEditedWorkflow), take(1))
  //     .subscribe((workflow: Workflow | null) => {
  //       if (workflow) {
  //         this.workflowUpdated = workflow;
  //         this.workflowForm.patchValue(workflow);
  //       }
  //     });
  // }

  // ngOnInit(): void {
  //   // Initialize the form group with form controls for Name and Description
  //   this.workflowForm = this.fb.group({
  //     name: ['', Validators.required],
  //     description: ['', Validators.required],
  //   });
  // }

  // Method to handle form submission
  updateWorkflow(): WorkflowFormCreate | null {
    if (this.workflowForm.valid) {
      const workflowMinPayload = filterPayload(this.workflowUpdated);
      return {
        ...workflowMinPayload,
        name: this.workflowForm.get('name')?.value,
        description: this.workflowForm.get('description')?.value,
      };
    } else {
      return null;
    }
  }
}
