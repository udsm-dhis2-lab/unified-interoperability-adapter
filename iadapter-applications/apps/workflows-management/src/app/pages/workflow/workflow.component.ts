import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from '../../shared/config/ant-design.modules';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { FlowchartComponent } from './containers/flow-chart/flow-chart.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { FlowConfigComponent } from './containers/flow-config/flow-config.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [
    CommonModule,
    NgFlowchartModule,
    NzTypographyModule,
    RouterModule,
    antDesignModules,
    WorkflowComponent,
    FlowchartComponent,
    FlowConfigComponent,
  ],
  templateUrl: './workflow.component.html',
  styleUrl: './workflow.component.scss',
})
export class WorkflowComponent {}
