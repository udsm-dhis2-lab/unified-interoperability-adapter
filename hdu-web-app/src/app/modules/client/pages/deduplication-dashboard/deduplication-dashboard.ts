import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { DuplicateGroup } from '@hdu/core';
import { mockDuplicateGroups } from 'src/app/core/data/mock-data';

@Component({
  selector: 'app-deduplication-dashboard',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './deduplication-dashboard.html',
  styleUrls: ['./deduplication-dashboard.scss'],
})
export class DeduplicationDashboard {
  constructor(private readonly router: Router) {}

  duplicateGroups: DuplicateGroup[] = mockDuplicateGroups;

  totalDuplicates = this.duplicateGroups.length;
  pendingDuplicates = this.duplicateGroups.filter((g) => g.status === 'pending').length;
  resolvedDuplicates = this.duplicateGroups.filter(
    (g) => g.status === 'merged' || g.status === 'dismissed',
  ).length;

  review(groupId: string): void {
    this.router.navigate(['/clients/deduplication', groupId]);
  }

  statusTag(status: DuplicateGroup['status']): { color: string; text: string } {
    const config = {
      pending: { color: 'orange', text: 'Pending Review' },
      merged: { color: 'green', text: 'Merged' },
      dismissed: { color: 'default', text: 'Dismissed' },
    } as const;
    return config[status];
  }

  progressStatus(score: number): 'success' | 'normal' | 'exception' {
    if (score >= 90) return 'exception';
    if (score >= 80) return 'normal';
    return 'success';
  }
}
