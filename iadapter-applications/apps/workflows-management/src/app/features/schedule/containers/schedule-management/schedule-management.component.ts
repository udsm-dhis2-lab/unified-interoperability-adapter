import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SchedulerParametersComponent } from '../scheduler-parameters/scheduler-parameters.component';
import { AddScheduleComponent } from '../add-schedule/add-schedule.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    RouterModule,
    SchedulerParametersComponent,
    AddScheduleComponent
  ],
  templateUrl: './schedule-management.component.html',
  styleUrl: './schedule-management.component.scss',
})
export class ScheduleManagementComponent {}
