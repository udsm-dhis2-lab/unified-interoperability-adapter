import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';
import { mockDuplicateGroups } from 'src/app/core/data/mock-data';
import { format } from 'date-fns';

@Component({
  selector: 'app-duplicate-review-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './duplicate-review.html',
  styleUrls: ['./duplicate-review.scss'],
})
export class DuplicateReview {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly message: NzMessageService = inject(NzMessageService);
  selectedMaster = '';
  duplicateGroup =
    mockDuplicateGroups.find((g) => g.id === this.route.snapshot.paramMap.get('groupId')) || null;

  constructor() {}

  back(): void {
    this.router.navigate(['/clients/deduplication']);
  }

  merge(): void {
    if (!this.selectedMaster) {
      this.message.warning('Please select a master record first');
      return;
    }
    this.message.success('Records merged successfully!');
    setTimeout(() => this.router.navigate(['/deduplication']), 1500);
  }

  dismiss(): void {
    this.message.info('Duplicate group dismissed');
    setTimeout(() => this.router.navigate(['/deduplication']), 1500);
  }

  matchFieldColor(field: string): string {
    if (!this.duplicateGroup) return 'default';
    return this.duplicateGroup.matchFields.includes(field) ? 'green' : 'red';
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy');
  }

  formatDateTime(date: string): string {
    return format(new Date(date), 'dd MMM yyyy, HH:mm');
  }
}
