/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  VERSION,
  TemplateRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  NgFlowchart,
  NgFlowchartCanvasDirective,
  NgFlowchartModule,
  NgFlowchartStepRegistry,
} from '@joelwenzel/ng-flowchart';
import {
  getWorkflowUidFromRoute,
  hasChildren,
  isRootNode,
  transformWorkflowToProcessTree,
} from '../../helpers/workflow.helper';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../state/workflow/workflow.state';
import {
  getCurrentSelectedProcessInWorkflow,
  getCurrentSelectedWorkflow,
  getUpdatedWorkflowStatus,
  getWorkflowById,
} from '../../state/workflow/workflow.selectors';
import { Workflow } from '../../models/workflow.model';
import { RootWorkflowNode } from '../../models/workflow-step.model';
import { ProcessState } from '../../state/process/process.state';
import { ProcessActions } from '../../state/process/process.actions';
import {
  getAddedProcessStatus,
  getCurrentProcessParentId,
  getCurrentSelectedProcess,
  getUpdatedProcessStatus,
} from '../../state/process/process.selectors';
import { FlowComponent } from '../flow/flow.component';
import { AddFlowComponent } from '../add-flow/add-flow.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { WorkflowActions } from '../../state/workflow/workflow.actions';
import { Observable, skip, Subscription, take } from 'rxjs';
import { Process } from '../../models/process.model';
import { WorkflowRunLoggingComponent } from '../../containers/workflow-run-logging/workflow-run-logging.component';
import { UpdateProcessComponent } from '../update-process/update-process.component';
import { omit } from 'lodash';

// Replace lodash imports with specific ES module imports

@Component({
  selector: 'app-flow-chart',
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
    NzCardModule,
    NzCollapseModule,
    NzFormModule,
    NzIconModule,
    NzBadgeModule,
    NzSpinModule,
    NzToolTipModule,
    NzMenuModule,
    NzDropDownModule,
    NzIconModule,
    NzIconModule,
    WorkflowRunLoggingComponent,
  ],
  templateUrl: './flow-chart.component.html',
  styleUrl: './flow-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowchartComponent implements OnInit, AfterViewInit, OnDestroy {
  isFlowChartHasChildren = false;
  isWorkflowNodeRoot = false;
  version = VERSION;
  stepGap = '';
  item1Checked = true;
  isWorkflowSelected = false;

  runningItems: Set<number> = new Set();

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 20,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED',
      skipRender: false,
    },
    dragScroll: ['RIGHT', 'MIDDLE'],
    orientation: 'VERTICAL',
    manualConnectors: false,
  };

  @ViewChild('workflowTreeStep')
  normalStepTemplate!: TemplateRef<any>;

  sequential = [{ label: 'Sequential', value: 'fhir', checked: false }];

  orientation = [{ label: 'Horizontal', value: 'fhir', checked: false }];

  workflowTree =
    '{ "id": "3665f635-1bd9-4b00-8529-ac852e0af218", "type": "log", "isRoot": true, "data": { "name": "Test Workflow 1", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "f4687ee8-d64e-4b53-b4ab-cd342b918d02", "type": "log", "data": { "name": "Template to FHIR", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [] } ] }';

  @ViewChild(NgFlowchartCanvasDirective)
  canvas!: NgFlowchartCanvasDirective;

  disabled = false;
  selectedFlowItem: any;
  isProcessRunning = false;

  currentSelectedWorkflowSubscription$!: Subscription;
  currentSelectedWorkflow$!: Observable<Workflow | null>;

  constructor(
    private stepRegistry: NgFlowchartStepRegistry,
    private nzModalService: NzModalService,
    private workFlowState: Store<WorkflowState>,
    private processState: Store<ProcessState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
    this.callbacks.afterDeleteStep = this.afterDeleteStep;
    this.callbacks.beforeDeleteStep = this.beforeDeleteStep;
    this.callbacks.onLinkConnector = this.onLinkConnector;
    this.callbacks.afterDeleteConnector = this.afterDeleteConnector;
    this.callbacks.afterScale = this.afterScale.bind(this);
  }

  ngOnDestroy(): void {
    if (this.currentSelectedWorkflowSubscription$) {
      this.currentSelectedWorkflowSubscription$.unsubscribe();
    }
  }

  ngOnInit(): void {
    const currentWorkflowUid = getWorkflowUidFromRoute(this.route);

    if (currentWorkflowUid) {
      void this.workFlowState.dispatch(
        WorkflowActions.loadWorkflow({
          id: currentWorkflowUid,
        })
      );

      this.currentSelectedWorkflow$ = this.workFlowState.pipe(
        select(getCurrentSelectedWorkflow)
      );

      this.currentSelectedWorkflowSubscription$ =
        this.currentSelectedWorkflow$.subscribe((workflow: Workflow | null) => {
          if (workflow) {
            const rootWorkflow: RootWorkflowNode =
              transformWorkflowToProcessTree(workflow);
            this.workflowTree = JSON.stringify(rootWorkflow);
            this.isWorkflowNodeRoot = isRootNode(rootWorkflow);
            this.selectedFlowItem = null;
            this.showUpload();
          }
        });
    }
  }

  ngAfterViewInit() {
    this.stepRegistry.registerStep('rest-get', this.normalStepTemplate);
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('nested-flow', FlowComponent);
  }

  onRunningProcess() {
    this.isProcessRunning = true;
  }

  onDropError(error: NgFlowchart.DropError) {
    console.log(error);
  }

  onMoveError(error: NgFlowchart.MoveError) {
    console.log(error);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beforeDeleteStep(step: any) {
    console.log(JSON.stringify(step.children));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterDeleteStep(step: any) {
    console.log(JSON.stringify(step.children));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLinkConnector(conn: any) {
    console.log(conn);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  afterDeleteConnector(conn: any) {
    console.log(conn);
  }

  afterScale(scale: number): void {
    //realistically you want to recursively get all steps in canvas
    if (this.canvas) {
      const firstSetOfChildren = this.canvas.getFlow().getRoot().children;
      firstSetOfChildren.forEach((step) => {
        if (step instanceof FlowComponent) {
          step.nestedCanvas.setNestedScale(scale);
        }
      });
    }
  }

  showUpload() {
    if (this.canvas) {
      this.canvas.getFlow().upload(this.workflowTree);
    }
  }

  showFlowData() {
    const json = this.canvas.getFlow().toJSON(4);

    const x = window.open();
    x?.document.open();
    x?.document.write(
      '<html><head><title>Flowchart Json</title></head><body><pre>' +
        json +
        '</pre></body></html>'
    );
    x?.document.close();
  }

  clearData() {
    if (this.canvas) {
      this.canvas.getFlow().clear();
    }
  }

  onSequentialChange(event: any) {
    this.options = {
      ...this.canvas.options,
      isSequential: event.target.checked,
    };
  }

  onOrientationChange(event: any) {
    this.canvas.setOrientation(
      event.target.checked ? 'HORIZONTAL' : 'VERTICAL'
    );
  }

  onDelete(id: any) {
    console.log(id);
    // this.canvas.getFlow().getStep(id).destroy(true);
  }

  onGrow() {
    this.canvas.scaleUp();
  }

  onShrink() {
    this.canvas.scaleDown();
  }

  onReset() {
    this.canvas.setScale(1);
  }

  onKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.onDelete(id); // Trigger the delete action when Enter or Space is pressed
      event.preventDefault(); // Prevent default behavior for Space key (like scrolling)
    }
  }

  onDoubleClickEdit(id: number) {
    console.log('THIS YAILAHI', id);
    const modalRef: NzModalRef<UpdateProcessComponent> =
      this.nzModalService.create({
        nzTitle: 'Process Management',
        nzContent: UpdateProcessComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzStyle: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          width: '80vh',
        },
        nzBodyStyle: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
        },
        nzWidth: '70vw',
        nzFooter: [
          {
            label: 'Close',
            onClick: () => {
              modalRef.destroy();
            },
          },
          {
            label: 'Update Process',
            type: 'primary',
            onClick: () => {
              const instance = modalRef.getContentComponent();
              const processFormUpdate = instance?.onSubmit();

              this.workFlowState
                .pipe(select(getCurrentSelectedWorkflow), take(1))
                .subscribe((workflow: Workflow | null) => {
                  if (workflow) {
                    this.processState
                      .pipe(
                        select(getCurrentSelectedProcessInWorkflow),
                        take(1)
                      )
                      .subscribe((currentSelectedProcess: Process | null) => {
                        if (currentSelectedProcess) {
                          if (!this.isWorkflowSelected) {
                            this.processState.dispatch(
                              ProcessActions.updateProcess({
                                process: {
                                  ...omit(currentSelectedProcess, ['children']),
                                  ...(processFormUpdate as any),
                                },
                              })
                            );
                          }

                          this.processState
                            .pipe(
                              select(getUpdatedProcessStatus),
                              skip(1),
                              take(1)
                            )
                            .subscribe((status: boolean) => {
                              if (status) {
                                this.workFlowState
                                  .pipe(
                                    select(getUpdatedWorkflowStatus),
                                    skip(1),
                                    take(1)
                                  )
                                  .subscribe(
                                    (workflowUpdatedStatus: boolean) => {
                                      if (workflowUpdatedStatus) {
                                        this.workFlowState.dispatch(
                                          WorkflowActions.loadWorkflow({
                                            id: workflow.id,
                                          })
                                        );
                                      }
                                    }
                                  );
                                modalRef.destroy();
                              }
                            });
                        }
                      });
                  }
                });
            },
          },
        ],
      });
  }

  onSelectingItem(id: number): void {
    if (id) {
      this.workFlowState
        .pipe(select(getWorkflowById(id)), take(1))
        .subscribe((workflow: Workflow | undefined) => {
          if (workflow) {
            this.isWorkflowSelected = true;
            this.selectedFlowItem = id;
          } else {
            this.selectedFlowItem = id;
            this.isWorkflowSelected = false;
            this.processState.dispatch(
              ProcessActions.setCurrentParentProcessId({
                id: this.selectedFlowItem,
              })
            );

            this.workFlowState.dispatch(
              WorkflowActions.setCurrentSelectedProcess({
                id: this.selectedFlowItem,
              })
            );
          }
        });
    }

    this.isFlowChartHasChildren = hasChildren(this.workflowTree, id.toString());
  }

  onRun(id: number): void {
    this.runningItems.add(id);
  }

  isRunning(id: number): boolean {
    return this.runningItems.has(id);
  }

  stepGaps = [20, 30, 40, 50, 60, 70, 80, 90];
  selectedGap = 20;

  onGapChanged(selectedValue: number): void {
    this.options = {
      ...this.canvas.options,
      stepGap: +selectedValue,
    };
  }

  onAddNew(): void {
    const modalRef: NzModalRef<AddFlowComponent> = this.nzModalService.create({
      nzTitle: 'Process Management',
      nzContent: AddFlowComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        width: '80vh',
      },
      nzBodyStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
      },
      nzWidth: '70vw',
      nzFooter: [
        {
          label: 'Close',
          onClick: () => {
            modalRef.destroy();
          },
        },
        {
          label: 'Save Process',
          type: 'primary',
          onClick: () => {
            const instance = modalRef.getContentComponent();
            const processFormCreate = instance?.onSubmit();

            this.processState.dispatch(
              ProcessActions.addProcess({
                process: processFormCreate as any,
              })
            );

            this.processState
              .pipe(select(getAddedProcessStatus), skip(1), take(1))
              .subscribe((status: boolean) => {
                if (status) {
                  this.workFlowState
                    .pipe(select(getCurrentSelectedWorkflow), take(1))
                    .subscribe((workflow: Workflow | null) => {
                      if (workflow) {
                        this.processState
                          .pipe(select(getCurrentSelectedProcess), take(1))
                          .subscribe(
                            (currentSelectedProcess: Process | null) => {
                              if (currentSelectedProcess) {
                                if (!this.isWorkflowSelected) {
                                  this.processState
                                    .pipe(
                                      select(getCurrentProcessParentId),
                                      take(1)
                                    )
                                    .subscribe(
                                      (
                                        currentProcessParentId: string | null
                                      ) => {
                                        if (currentProcessParentId) {
                                          this.processState.dispatch(
                                            ProcessActions.updateProcess({
                                              process: {
                                                ...currentSelectedProcess,
                                                parent: {
                                                  id: currentProcessParentId,
                                                },
                                              },
                                            })
                                          );
                                        }
                                      }
                                    );
                                } else {
                                  this.workFlowState.dispatch(
                                    WorkflowActions.updateWorkflow({
                                      workflow: {
                                        ...workflow,
                                        process: {
                                          id: currentSelectedProcess.id,
                                        },
                                      },
                                    })
                                  );
                                }

                                this.workFlowState
                                  .pipe(
                                    select(getUpdatedWorkflowStatus),
                                    skip(1),
                                    take(1)
                                  )
                                  .subscribe(
                                    (workflowUpdatedStatus: boolean) => {
                                      if (workflowUpdatedStatus) {
                                        this.workFlowState.dispatch(
                                          WorkflowActions.loadWorkflow({
                                            id: workflow.id,
                                          })
                                        );
                                      }
                                    }
                                  );
                              }
                            }
                          );
                      }
                    });
                  modalRef.destroy();
                }
              });
          },
        },
      ],
    });
  }

  zoomLevel = 1; // Default zoom level

  // Zoom in function
  zoomIn(): void {
    this.zoomLevel += 0.1; // Increase the zoom level
  }

  // Zoom out function
  zoomOut(): void {
    if (this.zoomLevel > 0.1) {
      // Prevent zooming out too much
      this.zoomLevel -= 0.1; // Decrease the zoom level
    }
  }

  onRunWorkflow() {
    this.workFlowState
      .pipe(select(getCurrentSelectedWorkflow), take(1))
      .subscribe((workflow: Workflow | null) => {
        if (workflow) {
          this.workFlowState.dispatch(
            WorkflowActions.runWorkflow({
              workflow,
            })
          );
        }
      });
  }

  // Method to get status badge color based on the process status
  getStatusBadgeColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'running':
        return 'success'; // Green
      case 'not started':
        return 'default'; // Grey
      case 'failed':
        return 'error'; // Red
      case 'error':
        return 'warning'; // Orange
      default:
        return 'default'; // Default color for unknown status
    }
  }

  // Method to get status tooltip text
  getStatusTooltip(status: string): string {
    switch (status.toLowerCase()) {
      case 'running':
        return 'The process is currently running smoothly.';
      case 'not started':
        return 'The process has not started yet.';
      case 'failed':
        return 'The process has failed. Please check the logs.';
      case 'error':
        return 'There was an error in the process.';
      default:
        return 'Status unknown.';
    }
  }

  // Method to get the status icon class based on the process status
  getStatusIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'running':
        return 'fas fa-check-circle'; // Icon for running (checkmark)
      case 'not started':
        return 'fas fa-clock'; // Icon for not started (clock)
      case 'failed':
        return 'fas fa-times-circle'; // Icon for failed (cross)
      case 'error':
        return 'fas fa-exclamation-triangle'; // Icon for error (warning triangle)
      default:
        return 'fas fa-question-circle'; // Default unknown status icon (question mark)
    }
  }

  process: any = {
    id: 'f4687ee8-d64e-4b53-b4ab-cd342b918d02',
    code: 'FHIR-TEMPLATE',
    created: '2024-10-10T09:14:18.000Z',
    updated: '2024-10-16T10:38:49.829Z',
    name: 'Template to FHIR',
    script: "console.log('YOOOH');\n",
    status: 'not-started',
    adaptors: [],
  };

  // Determine badge class based on the process status
  getStatusClass(status: string): string {
    switch (status) {
      case 'running':
        return 'badge-running';
      case 'completed':
        return 'badge-completed';
      case 'failed':
        return 'badge-failed';
      case 'error':
        return 'badge-error';
      case 'not-started':
        return 'badge-not-started';
      default:
        return '';
    }
  }

  onEditProcess() {
    // Handle edit logic here
    console.log('Edit process');
  }

  onDeleteProcess() {
    // Handle delete logic here
    console.log('Delete process');
  }

  onDuplicateProcess() {
    // Handle duplicate logic here
    console.log('Duplicate process');
  }
}
