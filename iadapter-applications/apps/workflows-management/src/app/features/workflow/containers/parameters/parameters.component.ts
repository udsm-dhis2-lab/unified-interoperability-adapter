import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Workflow, WorkflowFormCreate } from '../../models/workflow.model';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { getCurrentSelectedProcessInWorkflow } from '../../state/workflow/workflow.selectors';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ProcessSummaryComponent } from '../../components/process-summary/process-summary.component';
import { Process, ProcessCheckboxOption } from '../../models/process.model';
import { Observable, of, take } from 'rxjs';
import { ProcessState } from '../../state/process/process.state';
import { ProcessActions } from '../../state/process/process.actions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { toCamelCase } from '../../helpers/workflow.helper';
import { omit } from 'lodash';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    ReactiveFormsModule,
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    NzSpaceModule,
    NzCollapseModule,
    NzCheckboxModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    ProcessSummaryComponent,
  ],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss',
})
export class ParametersComponent implements OnInit, AfterViewInit {
  processParametersForm!: FormGroup;
  workflowUpdated!: Workflow;

  parameterFormGroup: FormGroup;

  currentSelectedProcess$: Observable<Process | null> = of(null);

  selectedAdaptors: string[] = [];

  checkboxOptions: ProcessCheckboxOption[] = [
    { label: 'FHIR', value: 'fhir', checked: false },
    { label: 'DHIS2', value: 'dhis', checked: false },
  ];

  constructor(
    private fb: FormBuilder,
    private workflowState: Store<WorkflowState>,
    private processState: Store<ProcessState>,
    private formBuilder: FormBuilder
  ) {
    this.parameterFormGroup = this.formBuilder.group({
      pairs: this.formBuilder.array([]),
    });
  }

  ngAfterViewInit(): void {
    this.workflowState
      .pipe(select(getCurrentSelectedProcessInWorkflow), take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess) {
          this.processParametersForm.patchValue(currentSelectedProcess);
        }
      });

    this.workflowState
      .pipe(select(getCurrentSelectedProcessInWorkflow))
      .subscribe((process: Process | null) => {
        if (process && process.adaptors) {
          this.updateCheckboxOptions(process.adaptors);
        }
      });
  }

  onCheckboxChange(updatedOptions: ProcessCheckboxOption[]): void {
    this.selectedAdaptors = updatedOptions
      .filter((option) => option.checked)
      .map((option) => option.value);
  }

  ngOnInit(): void {
    this.processParametersForm = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.currentSelectedProcess$ = this.workflowState.pipe(
      select(getCurrentSelectedProcessInWorkflow)
    );
  }

  updateCheckboxOptions(adaptors: string[]): void {
    this.checkboxOptions = this.checkboxOptions.map((option) => ({
      ...option,
      checked: adaptors.includes(option.value),
    }));

    this.selectedAdaptors = adaptors;
  }

  saveUpdateWorkflow(): WorkflowFormCreate | null {
    if (this.processParametersForm.valid) {
      return {
        ...this.workflowUpdated,
        name: this.processParametersForm.get('name')?.value,
        description: this.processParametersForm.get('description')?.value,
      };
    } else {
      return null;
    }
  }

  submitForm(): WorkflowFormCreate | null {
    if (this.processParametersForm.valid) {
      return {
        name: this.processParametersForm.get('name')?.value,
        description: this.processParametersForm.get('description')?.value,
      };
    } else {
      return null;
    }
  }

  onUpdateProcessAdapter() {
    this.currentSelectedProcess$
      .pipe(take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess) {
          const process: Process | null = {
            ...omit(currentSelectedProcess, ['children']),
            adaptors: this.selectedAdaptors,
          };

          this.processState.dispatch(ProcessActions.updateProcess({ process }));
        }
      });
  }

  get pairs(): FormArray {
    return this.parameterFormGroup.get('pairs') as FormArray;
  }

  addPair() {
    this.pairs.push(
      this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  removePair(index: number) {
    this.pairs.removeAt(index);
  }

  get getFinalParamJSON() {
    const jsonObject: { [key: string]: string } = {};
    this.pairs.controls.forEach((pair) => {
      const key = toCamelCase(pair.get('key')?.value);
      const value = toCamelCase(pair.get('value')?.value);
      if (key) {
        jsonObject[key] = value;
      }
    });
    return jsonObject;
  }

  onUpdateProcessParameter() {
    this.currentSelectedProcess$
      .pipe(take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess) {
          const process: Process | null = {
            ...currentSelectedProcess,
            adaptors: this.selectedAdaptors,
            parameters: this.getFinalParamJSON,
          };

          this.processState.dispatch(ProcessActions.updateProcess({ process }));
        }
      });
  }
}
