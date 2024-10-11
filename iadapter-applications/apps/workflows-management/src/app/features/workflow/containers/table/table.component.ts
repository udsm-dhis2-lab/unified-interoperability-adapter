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
import { AddComponent } from '../add/add.component';

import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { WorkflowState } from '../../state/workflow.state';
import { select, Store } from '@ngrx/store';
import { WorkflowActions } from '../../state/workflow.actions';
import { WorkflowService } from '../../services/workflow/workflow.service';
import { getWorkflows } from '../../state/workflow.selectors';
import { Workflow } from '../../models/workflow.model';
import { defaultIfEmpty } from 'rxjs';

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

  currentPageDataChange($event: readonly Workflow[]): void {
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

  workflows: readonly Workflow[] = [];
  workflowsData: readonly Workflow[] = [];

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private nzModalService: NzModalService,
    private workFlowState: Store<WorkflowState>
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

  ngOnInit(): void {
    this.workFlowState.dispatch(WorkflowActions.loadWorkflows());

    this.workFlowState
      .pipe(select(getWorkflows), defaultIfEmpty([]))
      .subscribe((workflows: Workflow[]) => {
        this.workflows = workflows.map((workflow: Workflow) => {
          return {
            ...workflow,
            checked: false,
            expand: false,
          };
        });
      });

    this.settingForm.valueChanges.subscribe((value) => {
      this.settingValue = value as Setting;
    });
    this.settingForm.controls.tableScroll.valueChanges.subscribe((scroll) => {
      this.fixedColumn = scroll === 'fixed';
      this.scrollX = scroll === 'scroll' || scroll === 'fixed' ? '100vw' : null;
    });
    this.settingForm.controls.fixHeader.valueChanges.subscribe((fixed) => {
      this.scrollY = fixed ? '240px' : null;
    });
  }

  onAddWorkflow() {
    // Programmatically create modal
    const modalRef: NzModalRef<AddComponent> = this.nzModalService.create({
      nzTitle: 'Add Workflow',
      nzContent: AddComponent,
      // nzComponentParams: {
      //   title: 'Hello, this is the title',
      //   content: 'This is the content passed to the modal component'
      // },
      nzMaskClosable: false, // Prevent closing by clicking outside
      nzClosable: false, // Hide the "X" close icon
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
        alignItems: 'stretch', // Allow content to stretch the full width
      },
      nzWidth: '50vw', // Set modal width to 70% of viewport width
      nzFooter: [
        {
          label: 'Close',
          onClick: () => {
            modalRef.destroy(); // Close the modal
          },
        },
        {
          label: 'Save Workflow',
          type: 'primary',
          onClick: () => {
            // const instance = modalRef.getContentComponent();
            // instance?.handleCustomAction();
            modalRef.destroy();
          },
        },
      ],
    });
  }
}
