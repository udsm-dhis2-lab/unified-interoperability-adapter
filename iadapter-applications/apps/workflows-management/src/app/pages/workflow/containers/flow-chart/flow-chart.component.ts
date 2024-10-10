/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  VERSION,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgFlowchart,
  NgFlowchartCanvasDirective,
  NgFlowchartModule,
  NgFlowchartStepRegistry,
} from '@joelwenzel/ng-flowchart';
import { FlowComponent } from '../../components/flow/flow.component';
import { hasChildren } from '../../helpers/workflow.helper';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddFlowComponent } from '../../components/add-flow/add-flow.component';
import { FormsModule } from '@angular/forms';

// Import Ng-Zorro components
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox'; // Ensure this is imported
import { NzSelectModule } from 'ng-zorro-antd/select';

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
  ],
  templateUrl: './flow-chart.component.html',
  styleUrl: './flow-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowchartComponent implements AfterViewInit {
  isFlowChartHasChildren = false;
  version = VERSION;
  stepGap = '';

  callbacks: NgFlowchart.Callbacks = {};
  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED',
      skipRender: false,
    },
    dragScroll: ['RIGHT', 'MIDDLE'],
    orientation: 'VERTICAL',
    manualConnectors: false,
  };

  @ViewChild('normalStep')
  normalStepTemplate!: TemplateRef<any>;

  sampleJson =
    '{ "root": { "id": "s1674421266194", "aina": "end", "type": "log", "data": { "name": "Workflow Step 1", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674421287973", "type": "log", "data": { "name": "Workflow Step 10", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674421969732", "type": "log", "data": { "name": "Workflow Step 12", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674428969732", "type": "log", "data": { "name": "Workflow Step 13", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674421239732", "type": "log", "data": { "name": "Workflow Step 14", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674423429732", "type": "log", "data": { "name": "Workflow Step 15", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s12314421969732", "type": "log", "data": { "name": "Workflow Step 16", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [] } ] } ] } ] } ] } ] }, { "id": "s1674421267973", "type": "log", "data": { "name": "Workflow Step 5", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674421269732", "type": "log", "data": { "name": "Workflow Step 6", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [] } ] }, { "id": "s1674421267975", "type": "log", "data": { "name": "Workflow Step 2", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [ { "id": "s1674421269738", "type": "log", "data": { "name": "Workflow Step 3", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [] } ] }, { "id": "s1674421268826", "type": "log", "data": { "name": "Workflow Step 4", "icon": { "name": "log-icon", "color": "blue" }, "config": { "message": null, "severity": null } }, "children": [] } ] }, "connectors": [ { "startStepId": "s1674421269738", "endStepId": "s1674421268826" } ] }';

  items = [
    {
      name: 'Logger',
      type: 'log',
      data: {
        name: 'Log',
        icon: { name: 'log-icon', color: 'blue' },
        config: {
          message: null,
          severity: null,
        },
      },
    },
  ];

  customOps = [
    {
      paletteName: 'Nested Flow',
      step: {
        template: FlowComponent,
        type: 'nested-flow',
        data: {
          name: 'Nested Flow',
        },
      },
    },
  ];

  @ViewChild(NgFlowchartCanvasDirective)
  canvas!: NgFlowchartCanvasDirective;

  disabled = false;
  selectedFlowItem: any;
  isProcessRunning = false;

  constructor(
    private stepRegistry: NgFlowchartStepRegistry,
    private nzModalService: NzModalService
  ) {
    this.callbacks.onDropError = this.onDropError;
    this.callbacks.onMoveError = this.onMoveError;
    this.callbacks.afterDeleteStep = this.afterDeleteStep;
    this.callbacks.beforeDeleteStep = this.beforeDeleteStep;
    this.callbacks.onLinkConnector = this.onLinkConnector;
    this.callbacks.afterDeleteConnector = this.afterDeleteConnector;
    this.callbacks.afterScale = this.afterScale.bind(this);
  }

  ngAfterViewInit() {
    // this.stepRegistry.registerStep('rest-get', this.normalStepTemplate);
    this.stepRegistry.registerStep('log', this.normalStepTemplate);
    this.stepRegistry.registerStep('nested-flow', FlowComponent);
    this.showUpload();
  }

  onRunningProcess() {
    this.isProcessRunning = true;

    setTimeout(() => {
      console.log("THIS IS MORE THAN WHAT IS EXPECTED");
      this.isProcessRunning = false;
      console.log("THIS IS MORE THAN WHAT IS EXPECTED::: ", this.isProcessRunning);

    }, 1000);
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
    const firstSetOfChildren = this.canvas.getFlow().getRoot().children;
    firstSetOfChildren.forEach((step) => {
      if (step instanceof FlowComponent) {
        step.nestedCanvas.setNestedScale(scale);
      }
    });
  }

  showUpload() {
    this.canvas.getFlow().upload(this.sampleJson);
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
    this.canvas.getFlow().clear();
  }

  // onGapChanged(event: any) {
  //   this.options = {
  //     ...this.canvas.options,
  //     stepGap: parseInt(event.target.value),
  //   };
  // }

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
    console.log(id)
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

  runningItems: Set<number> = new Set();

  onSelectingItem(id: number): void {
    this.selectedFlowItem = id;
    this.isFlowChartHasChildren = hasChildren(this.sampleJson, id.toString());
  }

  onRun(id: number): void {
    this.runningItems.add(id);
  }

  isRunning(id: number): boolean {
    return this.runningItems.has(id);
  }

  stepGaps = [30, 40, 50, 60, 70, 80, 90]; // Array for options
  selectedGap = 40; // Default selected value

  onGapChanged(selectedValue: number): void {
    console.log('THIS IS MORE THAN::: ', JSON.stringify(selectedValue));
    this.options = {
      ...this.canvas.options,
      stepGap: +selectedValue,
    };
  }

  onAddNew(): void {
    // Logic for adding a new item
    console.log('THIS IS MORE THAN WHAT IS EXPECTED');

    // Programmatically create modal
    const modalRef: NzModalRef<AddFlowComponent> = this.nzModalService.create({
      nzTitle: 'Workflow Management | Add/Edit Workflow Configuration',
      nzContent: AddFlowComponent,
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
      nzWidth: '70vw', // Set modal width to 70% of viewport width
      nzFooter: [
        {
          label: 'Close',
          onClick: () => {
            modalRef.destroy(); // Close the modal
          },
        },
        {
          label: 'Save Configuration',
          type: 'primary',
          onClick: () => {
            const instance = modalRef.getContentComponent();
            instance?.handleCustomAction();
            modalRef.destroy();
          },
        },
      ],
    });
  }
}
