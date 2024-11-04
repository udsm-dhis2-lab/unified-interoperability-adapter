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

import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { select, Store } from '@ngrx/store';
import { WorkflowActions } from '../../state/workflow/workflow.actions';
import { WorkflowService } from '../../services/workflow/workflow.service';
import {
  getUpdatedWorkflowStatus,
  getWorkflows,
  getWorkflowsLoadingStatus,
} from '../../state/workflow/workflow.selectors';
import {
  Workflow,
  WorkflowFormCreate,
  WorkflowTable,
} from '../../models/workflow.model';
import { defaultIfEmpty, Observable} from 'rxjs';
import { EditComponent } from '../edit/edit.component';
import { Router } from '@angular/router';
import { WorkflowRunLoggingComponent } from '../workflow-run-logging/workflow-run-logging.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

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
  selector: 'app-table',
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
    NzDropDownModule,
    NzTagModule,
    WorkflowRunLoggingComponent,
  ],
  providers: [WorkflowService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  settingForm: FormGroup<{ [K in keyof Setting]: FormControl<Setting[K]> }>;
  allChecked = false;
  indeterminate = false;
  fixedColumn = false;
  scrollX: string | null = null;
  scrollY: string | null = null;
  settingValue: Setting;

  loadingWorkflows$!: Observable<boolean | null>

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private addWorkflowNzModalService: NzModalService,
    private editWorkflowNzModalService: NzModalService,
    private workFlowState: Store<WorkflowState>,
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

  currentPageDataChange($event: readonly WorkflowTable[]): void {
    this.workflowsData = $event;
    // this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.workflowsData.filter((value) => !value.disabled);
    const allChecked =
      validData.length > 0 &&
      validData.every((value) => value.checked === true);
    const allUnChecked = validData.every((value) => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  checkAll(value: boolean): void {
    this.workflowsData.forEach((data) => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  workflows: readonly WorkflowTable[] = [];
  workflowsData: readonly WorkflowTable[] = [];

  ngOnInit(): void {
    this.workFlowState.dispatch(WorkflowActions.loadWorkflows());

    this.loadingWorkflows$ = this.workFlowState.pipe(
      select(getWorkflowsLoadingStatus)
    );

    this.workFlowState
      .pipe(select(getWorkflows), defaultIfEmpty([]))
      .subscribe((workflows: Workflow[]) => {
        this.workflows = workflows.map((workflow: Workflow) => {
          return {
            ...workflow,
            checked: false,
            expand: false,
          };
        }) as WorkflowTable[];
      });

    // this.settingForm.valueChanges.subscribe((value) => {
    //   this.settingValue = value as Setting;
    // });
    // this.settingForm.controls.tableScroll.valueChanges.subscribe((scroll) => {
    //   this.fixedColumn = scroll === 'fixed';
    //   this.scrollX = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    // });
    // this.settingForm.controls.fixHeader.valueChanges.subscribe((fixed) => {
    //   this.scrollY = fixed ? '240px' : null;
    // });
  }

  onAddWorkflow() {
    // const modalRef: NzModalRef<AddComponent> =
    //   this.addWorkflowNzModalService.create({
    //     nzTitle: 'Add Workflow',
    //     nzContent: AddComponent,
    //     nzMaskClosable: false,
    //     nzClosable: false,
    //     nzStyle: {
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       minHeight: '80vh',
    //       width: '80vh',
    //     },
    //     nzBodyStyle: {
    //       display: 'flex',
    //       flexDirection: 'column',
    //       justifyContent: 'center',
    //       alignItems: 'stretch',
    //     },
    //     nzWidth: '50vw',
    //     nzFooter: [
    //       {
    //         label: 'Close',
    //         onClick: () => {
    //           modalRef.destroy();
    //         },
    //       },
    //       {
    //         label: 'Save Workflow',
    //         type: 'primary',
    //         onClick: () => {
    //           const instance = modalRef.getContentComponent();
    //           const workflowFormCreate: WorkflowFormCreate | null =
    //             instance?.submitForm();

    //           this.workFlowState.dispatch(
    //             WorkflowActions.addWorkflow({
    //               workflow: workflowFormCreate as Workflow,
    //             })
    //           );

    //           this.workFlowState
    //             .pipe(select(getAddedWorkflowStatus))
    //             .subscribe((status: boolean) => {
    //               if (status) {
    //                 modalRef.destroy();
    //               }
    //             });
    //         },
    //       },
    //     ],
    //   });
    // const decodedUrl = decodeURIComponent(workflowTable.id);
    // this.router.navigate([decodeURIComponent('main/flow')]);
    this.router.navigate(['/', 'config', 'flow']);
  }

  onDeleteWorkflow(workflowTable: WorkflowTable) {
    if (workflowTable && workflowTable.id) {
      this.deleteflowNzModalService.confirm({
        nzTitle: `Are you sure you want to delete <strong>${workflowTable?.name}</strong>?`,
        nzContent:
          '<p style="font-size: 16px; color: #333; margin-bottom: 20px;">This action <span style="color: #f0ad4e; font-weight: bold;">cannot be undone</span>, and all associated data will be <span style="color: #d9534f; font-weight: bold;">permanently removed</span>. </p>',
        nzOkText: 'Yes',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.workFlowState.dispatch(
            WorkflowActions.deleteWorkflow({ workflow: workflowTable })
          );
        },
        nzCancelText: 'No',
        nzOnCancel: () => console.log('Cancel'),
      });
    }
  }

  onEditWorkflow(workflowTable: WorkflowTable) {
    if (workflowTable && workflowTable.id) {
      this.workFlowState.dispatch(
        WorkflowActions.setEditedWorkflow({ workflow: workflowTable })
      );

      const modalRef: NzModalRef<EditComponent> =
        this.editWorkflowNzModalService.create({
          nzTitle: 'Edit Workflow',
          nzContent: EditComponent,
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
          nzWidth: '50vw',
          nzFooter: [
            {
              label: 'Close',
              onClick: () => {
                modalRef.destroy();
              },
            },
            {
              label: 'Update Workflow',
              type: 'primary',
              onClick: () => {
                const instance = modalRef.getContentComponent();
                const workflowFormCreate: WorkflowFormCreate | null =
                  instance?.updateWorkflow();

                this.workFlowState.dispatch(
                  WorkflowActions.updateWorkflow({
                    workflow: workflowFormCreate as Workflow,
                  })
                );

                this.workFlowState
                  .pipe(select(getUpdatedWorkflowStatus))
                  .subscribe((status: boolean) => {
                    if (status) {
                      modalRef.destroy();
                    }
                  });
              },
            },
          ],
        });
    }
  }

  onRunWorkflow(workflowTable: WorkflowTable) {
    this.workFlowState.dispatch(
      WorkflowActions.runWorkflow({
        workflow: workflowTable as any,
      })
    );
  }

  onAddProcess(workflowTable: WorkflowTable) {
    if (workflowTable) {
      this.workFlowState.dispatch(
        WorkflowActions.setCurrentSelectedWorkflow({ workflow: workflowTable })
      );
      // this.router.navigate([decodeURIComponent('main/flow'), decodedUrl]);
      this.router.navigate(['/', 'config', 'flow', `${workflowTable.id}`]);
    }
  }
}
