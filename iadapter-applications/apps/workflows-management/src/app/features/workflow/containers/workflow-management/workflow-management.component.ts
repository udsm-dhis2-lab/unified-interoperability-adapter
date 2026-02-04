/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { select, Store } from '@ngrx/store';
import { getCurrentUrl } from 'apps/workflows-management/src/app/state/router.selector';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  NzTabChangeEvent,
  NzTabPosition,
  NzTabsModule,
} from 'ng-zorro-antd/tabs';
import { Observable, of, take } from 'rxjs';
import { FlowchartComponent } from '../../components/flow-chart/flow-chart.component';
import { ProcessSummaryComponent } from '../../components/process-summary/process-summary.component';
import {
  extractIdFromPath,
  getWorkflowUidFromRoute,
} from '../../helpers/workflow.helper';
import { Process } from '../../models/process.model';
import { Workflow } from '../../models/workflow.model';
import { WorkflowActions } from '../../state/workflow/workflow.actions';
import {
  getCurrentSelectedProcessInWorkflow,
  getCurrentSelectedWorkflow,
} from '../../state/workflow/workflow.selectors';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { AddComponent } from '../add/add.component';
import { EditComponent } from '../edit/edit.component';
import { EditorComponent } from '../editor/editor.component';
import { ParametersComponent } from '../parameters/parameters.component';
import { WorkflowRunLoggingComponent } from '../workflow-run-logging/workflow-run-logging.component';

@Component({
  selector: 'app-workflow-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgFlowchartModule,
    RouterModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzTabsModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzDescriptionsModule,
    NzCollapseModule,
    NzCheckboxModule,
    AddComponent,
    ParametersComponent,
    EditorComponent,
    WorkflowRunLoggingComponent,
    EditComponent,
  ],
  templateUrl: './workflow-management.component.html',
  styleUrl: './workflow-management.component.scss',
})
export class WorkflowManagementComponent implements OnInit {
  selectedTabIndex = 0;
  nzTabPosition!: NzTabPosition;
  currentWorkflowUid!: string | null;
  currentSelectedWorkflow$!: Observable<Workflow | null>;
  isRunningProcessReady = false;

  currentSelectedProcess$: Observable<Process | null> = of(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workflowState: Store<WorkflowState>
  ) {}

  ngOnInit(): void {
    this.currentSelectedProcess$ = this.workflowState.pipe(
      select(getCurrentSelectedProcessInWorkflow)
    );

    this.currentWorkflowUid = getWorkflowUidFromRoute(this.route);

    if (this.currentWorkflowUid) {
      this.workflowState.dispatch(
        WorkflowActions.loadWorkflow({
          id: this.currentWorkflowUid,
        })
      );
    }

    this.currentSelectedWorkflow$ = this.workflowState.pipe(
      select(getCurrentSelectedWorkflow)
    );
  }

  onTabChange(nzTabChangeEvent: NzTabChangeEvent) {
    if (this.workflowState) {
      this.workflowState
        .pipe(select(getCurrentUrl), take(1))
        .subscribe((route: string) => {
          if (route) {
            if (
              nzTabChangeEvent &&
              (nzTabChangeEvent.index == 0 || nzTabChangeEvent.index == 1)
            ) {
              const uid = extractIdFromPath(route, 4);
              this.router.navigate([
                '/',
                'workflows-management',
                'config',
                'flow',
                uid,
              ]);
            }
          }
        });
    } else {
      console.error('workflowState is undefined');
    }
  }

  onRunWorkflow() {
    this.workflowState
      .pipe(select(getCurrentSelectedWorkflow), take(1))
      .subscribe((workflow: Workflow | null) => {
        if (workflow) {
          this.workflowState.dispatch(
            WorkflowActions.runWorkflow({
              workflow,
            })
          );
        }
      });
  }
}
