/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleState } from '../../state/schedule/schedule.state';
import { select, Store } from '@ngrx/store';

import { TaskState } from '../../../workflow/state/task/task.state';
import { getExecutedScheduleTask } from '../../state/schedule/schedule.selectors';
import { ExecutedScheduleTask } from '../../models/runned.model';
import { ScheduleActions } from '../../state/schedule/schedule.actions';
import { distinctUntilChanged, Subscription, take } from 'rxjs';

interface Log {
  time: string;
  message: string;
  type:
    | 'log'
    | 'error'
    | 'success'
    | 'warning'
    | 'LOG'
    | 'ERROR'
    | 'SUCCESS'
    | 'WARNING';
}

@Component({
  selector: 'app-schedule-run-logging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-run-logging.component.html',
  styleUrl: './schedule-run-logging.component.scss',
})
export class ScheduleRunLoggingComponent implements OnInit, OnChanges {
  appIcon = 'assets/images/logo.png';

  @ViewChild('logContainer') private logContainer!: ElementRef;
  isLogOpen = false;
  logs: Log[] = [];
  currentRunningTaskLogs: Log[] = [];
  executedScheduleTask$!: Subscription;
  @Input() currentExecutedScheduleTask!: ExecutedScheduleTask | null;

  constructor(
    private scheduleState: Store<ScheduleState>,
    private taskState: Store<TaskState>
  ) {
    this.addLog('HDU API Init Log', 'log');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes['currentExecutedScheduleTask'] &&
      changes['currentExecutedScheduleTask'].currentValue
    ) {
      this.printLogs(changes['currentExecutedScheduleTask'].currentValue.logs);
    }
  }

  printLogs(logs: Log[]) {
    if (logs && logs.length > 0) {
      this.isLogOpen = true;
      for (const log of logs) {
        this.addLog(
          log.message,
          'success' as
            | 'log'
            | 'error'
            | 'success'
            | 'warning'
            | 'LOG'
            | 'ERROR'
            | 'SUCCESS'
            | 'WARNING'
        );
      }
    }
  }

  ngOnInit(): void {
    console.log('Log Init');
    // this.executedScheduleTask$ = this.scheduleState
    //   .pipe(select(getExecutedScheduleTask), take(1))
    //   .subscribe((executedScheduleTask: ExecutedScheduleTask | null) => {
    //     if (executedScheduleTask) {
    //       this.isLogOpen = true;

    //       this.scheduleState.dispatch(
    //         ScheduleActions.loadCurrentScheduledTask({
    //           executedScheduleTask,
    //         })
    //       );

    //       if (
    //         executedScheduleTask &&
    //         executedScheduleTask.logs &&
    //         executedScheduleTask.logs.length
    //       ) {
    //         this.currentRunningTaskLogs = [
    //           ...(executedScheduleTask.logs as Log[]),
    //         ];

    //         for (const log of this.currentRunningTaskLogs) {
    //           this.addLog(
    //             log.message,
    //             'success' as
    //               | 'log'
    //               | 'error'
    //               | 'success'
    //               | 'warning'
    //               | 'LOG'
    //               | 'ERROR'
    //               | 'SUCCESS'
    //               | 'WARNING'
    //           );
    //         }
    //         if (this.executedScheduleTask$) {
    //           this.executedScheduleTask$.unsubscribe();
    //         }
    //       }
    //     }
    //   });
  }

  toggleLogMonitor() {
    this.isLogOpen = !this.isLogOpen;
  }

  addLog(
    message: string,
    type:
      | 'log'
      | 'error'
      | 'success'
      | 'warning'
      | 'LOG'
      | 'ERROR'
      | 'SUCCESS'
      | 'WARNING'
  ) {
    const time = new Date().toLocaleString();
    this.logs.push({ time, message, type });
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (
      this.logContainer &&
      this.logContainer.nativeElement &&
      this.logContainer.nativeElement.scrollTop &&
      this.logContainer.nativeElement.scrollHeight
    ) {
      try {
        this.logContainer.nativeElement.scrollTop =
          this.logContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error auto-scrolling log container:', err);
      }
    }
  }
}
