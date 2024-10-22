import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowchartComponent } from '../../components/flow-chart/flow-chart.component';
import { WorkflowManagementComponent } from '../workflow-management/workflow-management.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FlowchartComponent, WorkflowManagementComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
