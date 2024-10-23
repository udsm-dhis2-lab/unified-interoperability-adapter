import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Observable, skip, take } from 'rxjs';
import { Workflow } from '../../../workflow/models/workflow.model';
import { WorkflowActions } from '../../../workflow/state/workflow/workflow.actions';
import {
  getAddingWorkflowStatus,
  getAddedWorkflowStatus,
  getWorkflows,
  getWorkflowLoadingStatus,
} from '../../../workflow/state/workflow/workflow.selectors';
import { WorkflowState } from '../../../workflow/state/workflow/workflow.state';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ProcessState } from '../../../workflow/state/process/process.state';
import { Cron } from '../../models/cron.model';
import { ScheduleActions } from '../../state/schedule/schedule.actions';
import { Schedule } from '../../models/schedule.model';
import { ScheduleState } from '../../state/schedule/schedule.state';
import {
  getCurrentSelectedSchedule,
  getUpdatedScheduleStatus,
} from '../../state/schedule/schedule.selectors';
import { getUidFromRoute } from '../../../workflow/helpers/workflow.helper';

@Component({
  selector: 'app-edit-schedule',
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
    NzSpinModule,
    NzSelectModule,
  ],
  templateUrl: './edit-schedule.component.html',
  styleUrl: './edit-schedule.component.scss',
})
export class EditScheduleComponent implements OnInit, AfterViewInit {
  scheduleForm!: FormGroup;
  currentSelectedSchedule!: Schedule | null;
  currentSelectedSchedule$!: Observable<Schedule | null>;

  workflowUpdated!: Workflow;
  savingWorkflowStatus$!: Observable<boolean>;
  savedWorkflowStatus$!: Observable<boolean>;

  workflowLoadingStatus$!: Observable<boolean | null>;

  inputValue = '';

  cronSchedules: Cron[] = [
    { name: 'Every Minute', value: '* * * * *' },
    { name: 'Every 5 Minutes', value: '*/5 * * * *' },
    { name: 'Every 15 Minutes', value: '*/15 * * * *' },
    { name: 'Every 30 Minutes', value: '*/30 * * * *' },
    { name: 'Every Hour', value: '0 * * * *' },
    { name: 'Every 2 Hours', value: '0 */2 * * *' },
    { name: 'Every Day at Midnight', value: '0 0 * * *' },
    { name: 'Every Day at 6 AM', value: '0 6 * * *' },
    { name: 'Every Week (Sunday Midnight)', value: '0 0 * * 0' },
    { name: 'Every Month (1st at Midnight)', value: '0 0 1 * *' },
    { name: 'Every Year (January 1st at Midnight)', value: '0 0 1 1 *' },
  ];

  workflows$!: Observable<Workflow[] | null>;

  constructor(
    private fb: FormBuilder,
    private workFlowState: Store<WorkflowState>,
    private scheduleState: Store<ScheduleState>,
    private processState: Store<ProcessState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.scheduleState
      .pipe(select(getCurrentSelectedSchedule, take(1)))
      .subscribe((schedule: Schedule | null) => {
        if (schedule) {
          this.scheduleForm.patchValue(schedule);
        }
      });
  }

  ngOnInit(): void {
    this.workFlowState.dispatch(WorkflowActions.loadWorkflows());

    this.workflowLoadingStatus$ = this.workFlowState.pipe(
      select(getWorkflowLoadingStatus)
    );

    this.workflows$ = this.workFlowState.pipe(select(getWorkflows));

    this.scheduleForm = this.fb.group({
      name: ['', Validators.required],
      code: [''],
      description: ['', Validators.required],
      cron: ['', Validators.required],
      parameters: [''],
      workflow: this.fb.group({
        id: ['', Validators.required],
      }),
    });

    this.savingWorkflowStatus$ = this.workFlowState.pipe(
      select(getAddingWorkflowStatus)
    );
    this.savedWorkflowStatus$ = this.workFlowState.pipe(
      select(getAddedWorkflowStatus)
    );

    const currentScheduleUid = getUidFromRoute(this.route);

    if (currentScheduleUid) {
      this.scheduleState.dispatch(
        ScheduleActions.loadSchedule({
          id: currentScheduleUid,
        })
      );

      this.currentSelectedSchedule$ = this.scheduleState.pipe(
        select(getCurrentSelectedSchedule)
      );

      this.currentSelectedSchedule$
        .pipe(skip(1), take(1))
        .subscribe((currentSelectedSchedule: Schedule | null) => {
          if (currentSelectedSchedule && currentSelectedSchedule.workflow) {
            this.currentSelectedSchedule = currentSelectedSchedule;
            this.scheduleForm.patchValue(currentSelectedSchedule);
          }
        });
    }
  }

  onUpdateWorkflow() {
    if (this.scheduleForm.valid) {
      this.workFlowState
        .pipe(select(getCurrentSelectedSchedule, take(1)))
        .subscribe((schedule: Schedule | null) => {
          if (schedule) {
            this.scheduleForm.patchValue(schedule);
          }
        });

      this.scheduleState.dispatch(
        ScheduleActions.updateSchedule({
          schedule: {
            ...this.currentSelectedSchedule,
            ...(this.scheduleForm.value as Schedule),
          },
        })
      );

      this.scheduleState
        .pipe(select(getUpdatedScheduleStatus), skip(1), take(1))
        .subscribe((status: boolean) => {
          if (status) {
            this.scheduleForm.reset();
            this.router.navigate(['schedules']);
          }
        });
    }
  }
}
