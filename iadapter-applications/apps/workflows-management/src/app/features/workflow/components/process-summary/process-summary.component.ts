import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Process } from '../../models/process.model';

@Component({
  selector: 'app-process-summary',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './process-summary.component.html',
  styleUrl: './process-summary.component.scss',
})
export class ProcessSummaryComponent {
  @Input() currentSelectedProcess!: Process | null;
}
