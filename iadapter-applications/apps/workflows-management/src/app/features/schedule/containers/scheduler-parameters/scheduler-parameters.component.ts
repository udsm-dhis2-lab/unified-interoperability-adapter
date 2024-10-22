import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../../workflow/state/workflow/workflow.state';
import { ProcessState } from '../../../workflow/state/process/process.state';
import { toCamelCase } from '../../../workflow/helpers/workflow.helper';
import { ScheduleState } from '../../state/schedule/schedule.state';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { Observable, skip, take } from 'rxjs';
import {
  getCurrentSelectedSchedule,
  getUpdatedScheduleStatus,
  getUpdatingScheduleStatus,
} from '../../state/schedule/schedule.selectors';
import { Schedule } from '../../models/schedule.model';
import { RouterStateUrl } from 'apps/workflows-management/src/app/shared/models/router.model';
import { ScheduleActions } from '../../state/schedule/schedule.actions';

@Component({
  selector: 'app-scheduler-parameters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  ],
  templateUrl: './scheduler-parameters.component.html',
  styleUrl: './scheduler-parameters.component.scss',
})
export class SchedulerParametersComponent implements OnInit, AfterViewInit {
  schedulerParametersForm!: FormGroup;

  currentSelectedSchedule$!: Observable<Schedule | null>;
  updatingSchedule$!: Observable<boolean>;

  parameterFormGroup: FormGroup;

  selectedAdaptors: string[] = [];

  initialJSON = {
    username: 'abc',
  };

  constructor(
    private fb: FormBuilder,
    private workflowState: Store<WorkflowState>,
    private processState: Store<ProcessState>,
    private scheduleState: Store<ScheduleState>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private routerState: Store<RouterReducerState<RouterStateUrl>>
  ) {
    this.parameterFormGroup = this.formBuilder.group({
      pairs: this.formBuilder.array([], Validators.required),
    });
  }

  ngAfterViewInit(): void {
    this.currentSelectedSchedule$
      .pipe(skip(1), take(1))
      .subscribe((currentSelectedSchedule: Schedule | null) => {
        if (currentSelectedSchedule) {
          this.patchValues(currentSelectedSchedule.parameters);
        }
      });
  }

  ngOnInit(): void {
    this.currentSelectedSchedule$ = this.scheduleState.pipe(
      select(getCurrentSelectedSchedule)
    );

    this.updatingSchedule$ = this.scheduleState.pipe(
      select(getUpdatingScheduleStatus)
    );
  }

  get pairs(): FormArray {
    return this.parameterFormGroup.get('pairs') as FormArray;
  }

  patchValues(json: any) {
    this.pairs.clear();

    Object.keys(json).forEach((key) => {
      this.pairs.push(
        this.fb.group({
          key: [key, Validators.required],
          value: [json[key], Validators.required],
        })
      );
    });
  }

  onAddParams() {
    this.scheduleState
      .pipe(select(getCurrentSelectedSchedule), take(1))
      .subscribe((schedule: Schedule | null) => {
        if (schedule) {
          const schedulePayload: Schedule = {
            ...schedule,
            parameters: this.getFinalParamJSON,
          };

          this.scheduleState.dispatch(
            ScheduleActions.updateSchedule({
              schedule: schedulePayload as Schedule,
            })
          );
        }
      });
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
}
