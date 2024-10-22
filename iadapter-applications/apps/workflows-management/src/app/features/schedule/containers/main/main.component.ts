import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule } from '@angular/forms';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ScheduleManagementComponent } from '../schedule-management/schedule-management.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
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
    NzFormModule,
    NzBadgeModule,
    NzIconModule,
    NzSpinModule,
    NzToolTipModule,
    NzLayoutModule,
    ScheduleManagementComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {}
