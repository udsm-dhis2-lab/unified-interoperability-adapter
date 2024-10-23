/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { select, Store } from '@ngrx/store';
import { getExecutedWorkflow } from '../../state/workflow/workflow.selectors';
import { ExecutedWorkflow } from '../../models/runned.model';
import { TaskState } from '../../state/task/task.state';
import { TaskActions } from '../../state/task/task.actions';
import { getCurrentRunningTask } from '../../state/task/task.selectors';
import { Task } from '../../models/task.model';
import { take } from 'rxjs';

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
  selector: 'app-workflow-run-logging',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-run-logging.component.html',
  styleUrl: './workflow-run-logging.component.scss',
})
export class WorkflowRunLoggingComponent implements OnInit {
  appIcon = 'assets/images/logo.png';

  @ViewChild('logContainer') private logContainer!: ElementRef;
  isLogOpen = false;
  logs: Log[] = [];
  currentRunningTaskLogs: Log[] = [];

  constructor(
    private workFlowState: Store<WorkflowState>,
    private taskState: Store<TaskState>
  ) {
    this.addLog('HDU API Init Log', 'log');
  }

  ngOnInit(): void {
    this.workFlowState
      .pipe(select(getExecutedWorkflow))
      .subscribe((executedWorkflow: ExecutedWorkflow | null) => {
        if (executedWorkflow) {
          this.isLogOpen = true;

          this.taskState.dispatch(
            TaskActions.loadTask({
              id: executedWorkflow.id,
            })
          );

          if (
            executedWorkflow &&
            executedWorkflow.logs &&
            executedWorkflow.logs.length
          ) {
            this.currentRunningTaskLogs = [...(executedWorkflow.logs as Log[])];
            this.taskState.dispatch(
              TaskActions.getCurrentRunningTask({
                id: executedWorkflow.id,
              })
            );

            setInterval(() => {
              this.taskState
                .pipe(select(getCurrentRunningTask), take(1))
                .subscribe((task: Task | null) => {
                  if (task) {
                    this.currentRunningTaskLogs = [
                      ...(this.currentRunningTaskLogs as Log[]),
                      ...(task.logs as Log[]),
                    ];
                  }
                });

              for (const log of this.currentRunningTaskLogs) {
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
            }, 5000);
          }
        }
      });
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
