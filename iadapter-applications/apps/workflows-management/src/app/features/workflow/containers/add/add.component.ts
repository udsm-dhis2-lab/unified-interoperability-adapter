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
import { Workflow, WorkflowFormCreate } from '../../models/workflow.model';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../state/workflow.state';
import { getEditedWorkflow } from '../../state/workflow.selectors';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, NzInputModule, ReactiveFormsModule, NzGridModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit, AfterViewInit {
  workflowForm!: FormGroup;
  workflowUpdated!: Workflow;

  constructor(
    private fb: FormBuilder,
    private workFlowState: Store<WorkflowState>
  ) {}

  ngAfterViewInit(): void {
    this.workFlowState
      .pipe(select(getEditedWorkflow))
      .subscribe((workflow: Workflow | null) => {
        if (workflow) {
          this.workflowUpdated = workflow;
          this.workflowForm.patchValue(workflow);
        }
      });
  }

  ngOnInit(): void {
    // Initialize the form group with form controls for Name and Description
    this.workflowForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  // Method to handle form submission
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

  // Method to handle form submission
  submitForm(): WorkflowFormCreate | null {
    if (this.workflowForm.valid) {
      return {
        name: this.workflowForm.get('name')?.value,
        description: this.workflowForm.get('description')?.value,
      };
    } else {
      return null;
    }
  }
}
