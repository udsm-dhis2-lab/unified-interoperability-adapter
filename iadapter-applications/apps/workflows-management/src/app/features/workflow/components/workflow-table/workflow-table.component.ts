import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface DataItem {
  sn: number;
  name: string;
  lastRun: string;
  status: string;
  created: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-workflow-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzInputModule,
    NzPaginationModule,
    FormsModule,
  ],
  templateUrl: './workflow-table.component.html',
  styleUrl: './workflow-table.component.scss',
})
export class WorkflowTableComponent {
  searchTerm = '';
  pageSize = 15; // Set to 12 items per page
  currentPage = 1;

  constructor(private router: Router) {}

  // Sample data with more than 30 records
  data: DataItem[] = Array.from({ length: 35 }, (_, i) => ({
    sn: i + 1,
    name: `Workflow ${String.fromCharCode(65 + (i % 5))}`, // Rotate between Task A to Task E
    lastRun: `2024-10-${String((i % 30) + 1).padStart(2, '0')}`,
    status:
      i % 4 === 0
        ? 'Not Started'
        : i % 4 === 1
          ? 'Running'
          : i % 4 === 2
            ? 'Completed'
            : 'Failed',
    created: `2024-09-${String((i % 30) + 1).padStart(2, '0')}`,
    lastUpdated: `2024-10-${String((i % 30) + 1).padStart(2, '0')}`,
  }));

  // Getter to filter data based on the search term
  get filteredData() {
    return this.data.filter((item) =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Get paginated data
  get paginatedData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredData.slice(start, end);
  }

  // Method to handle row click
  onRowClick(item: DataItem): void {
    console.log('Row clicked:', item);
    // You can implement navigation or other logic here
    this.router.navigate(['/workflows']);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Not Started':
        return 'not-started';
      case 'Running':
        return 'running';
      case 'Completed':
        return 'completed';
      case 'Failed':
        return 'failed';
      default:
        return '';
    }
  }
}
