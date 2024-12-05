/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { select, Store } from '@ngrx/store';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  skip,
  take,
} from 'rxjs';
import { Router } from '@angular/router';
import { ScheduleState } from '../../state/schedule/schedule.state';
import { Schedule, ScheduleTable } from '../../models/schedule.model';
import { ScheduleActions } from '../../state/schedule/schedule.actions';
import {
  getExecutedScheduleTask,
  getScheduleLoadingStatus,
  getSchedules,
  getSchedulesLoadingStatus,
} from '../../state/schedule/schedule.selectors';
import { ScheduleRunLoggingComponent } from '../schedule-run-logging/schedule-run-logging.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ExecutedScheduleTask } from '../../models/runned.model';

type TableScroll = 'unset' | 'scroll' | 'fixed';

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: TableScroll;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}

@Component({
  selector: 'app-schedule-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzTableModule,
    NzDividerModule,
    NzRadioModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzModalModule,
    NzCollapseModule,
    NzDropDownModule,
    NzTagModule,
    NzGridModule,
    ScheduleRunLoggingComponent,
  ],
  templateUrl: './schedule-table.component.html',
  styleUrl: './schedule-table.component.scss',
})
export class ScheduleTableComponent implements OnInit {
  settingForm: FormGroup<{ [K in keyof Setting]: FormControl<Setting[K]> }>;
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;
  loadingSchedule$!: Observable<boolean | null>;

  searchControl = new FormControl();

  currentExecutedScheduleTask$!: Observable<ExecutedScheduleTask | null>;
  schedules: readonly ScheduleTable[] = [];
  schedulesData: readonly ScheduleTable[] = [];
  filteredSchedules: readonly ScheduleTable[] = [];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private addScheduleNzModalService: NzModalService,
    private editScheduleNzModalService: NzModalService,
    private scheduleState: Store<ScheduleState>,
    private deleteflowNzModalService: NzModalService,
    private router: Router
  ) {
    this.settingForm = this.formBuilder.group({
      bordered: [false],
      loading: [false],
      pagination: [true],
      sizeChanger: [false],
      title: [true],
      header: [true],
      footer: [true],
      expandable: [true],
      checkbox: [true],
      fixHeader: [false],
      noResult: [false],
      ellipsis: [false],
      simple: [false],
      size: 'small' as NzTableSize,
      paginationType: 'default' as NzTablePaginationType,
      tableScroll: 'unset' as TableScroll,
      tableLayout: 'auto' as NzTableLayout,
      position: 'bottom' as NzTablePaginationPosition,
    });

    this.settingValue = this.settingForm.value as Setting;
  }

  currentPageDataChange($event: readonly ScheduleTable[]): void {
    this.schedulesData = $event;
    // this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.schedulesData.filter((value) => !value.disabled);
    const allChecked =
      validData.length > 0 &&
      validData.every((value) => value.checked === true);
    const allUnChecked = validData.every((value) => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.schedulesData.forEach((data) => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  ngOnInit(): void {
    this.scheduleState.dispatch(ScheduleActions.loadSchedules());

    this.loadingSchedule$ = this.scheduleState.pipe(
      select(getSchedulesLoadingStatus)
    );

    this.scheduleState
      .pipe(select(getSchedules), skip(1), take(1))
      .subscribe((schedules: Schedule[]) => {
        this.schedules = schedules.map((schedule: Schedule) => {
          return {
            ...schedule,
            checked: false,
            expand: false,
          };
        }) as ScheduleTable[];
        this.filteredSchedules = this.schedules;
      });

    this.searchControl.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.onSearch(searchTerm);
      });
  }

  onSearch(searchTerm: string): void {
    this.filteredSchedules = this.filterSchedules(searchTerm);
  }

  filterSchedules(searchTerm: string): ScheduleTable[] {
    if (!searchTerm) {
      return [...this.schedules];
    }

    searchTerm = searchTerm.toLowerCase();

    return this.schedules.filter((schedule) =>
      Object.values(schedule).some((value) =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
  }

  onAddSchedule() {
    this.router.navigate(['/', 'workflows-management', 'config', 'add']);
  }

  onDeleteSchedule(scheduleTable: ScheduleTable) {
    if (scheduleTable && scheduleTable.id) {
      this.deleteflowNzModalService.confirm({
        nzTitle: `Are you sure you want to delete <strong>${scheduleTable?.name}</strong>?`,
        nzContent:
          '<p style="font-size: 16px; color: #333; margin-bottom: 20px;">This action <span style="color: #f0ad4e; font-weight: bold;">cannot be undone</span>, and all associated data will be <span style="color: #d9534f; font-weight: bold;">permanently removed</span>. </p>',
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.scheduleState.dispatch(
            ScheduleActions.deleteSchedule({ schedule: scheduleTable })
          );
        },
        nzCancelText: 'No',
        nzOnCancel: () => console.log('Cancel'),
      });
    }
  }

  onEditSchedule(scheduleTable: ScheduleTable) {
    if (scheduleTable && scheduleTable.id) {
      this.scheduleState.dispatch(
        ScheduleActions.setCurrentSelectedSchedule({ schedule: scheduleTable })
      );

      this.router.navigate([
        '/',
        'workflows-management',
        'schedules',
        'config',
        'edit',
        scheduleTable.id,
      ]);
    }
  }

  onViewLogs(scheduleTable: ScheduleTable) {
    if (scheduleTable && scheduleTable.task) {
      this.scheduleState.dispatch(
        ScheduleActions.setCurrentExecutedScheduleTask({
          executedScheduleTask: scheduleTable.task as ExecutedScheduleTask,
        })
      );
    }

    this.currentExecutedScheduleTask$ = this.scheduleState.pipe(
      select(getExecutedScheduleTask)
    );
  }
}
