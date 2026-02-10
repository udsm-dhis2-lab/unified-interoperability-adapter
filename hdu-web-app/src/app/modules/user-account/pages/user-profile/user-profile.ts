import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { AuthService } from '@hdu/core';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.scss'],
})
export class UserProfile {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  userInfo = this.auth.userInfo;

  profile = {
    userId: 'USR-001',
    firstName: 'Amina',
    lastName: 'Mwakasege',
    email: this.userInfo()?.email || 'amina.mwakasege@health.go.tz',
    phoneNumber: '+255 755 123 456',
    role: this.userInfo()?.role || 'Health Professional',
    department: 'Cardiology',
    facility: 'Muhimbili National Hospital',
    region: 'Dar es Salaam',
    status: 'active',
    joinDate: '2025-06-15',
    lastLogin: '2026-02-04 08:30',
    authorities: [
      'VIEW_PATIENTS',
      'EDIT_PATIENTS',
      'VIEW_RECORDS',
      'EDIT_RECORDS',
      'MANAGE_APPOINTMENTS',
      'MANAGE_REFERRALS',
    ],
    recentActivity: [
      { date: '2026-02-04 08:30', action: 'Logged in to system', type: 'login' },
      { date: '2026-02-03 16:45', action: 'Updated patient record PT-123456', type: 'update' },
      { date: '2026-02-03 14:20', action: 'Created appointment APT-2026-001234', type: 'create' },
      { date: '2026-02-03 11:15', action: 'Viewed health records for PT-789456', type: 'view' },
      { date: '2026-02-02 17:00', action: 'Logged out of system', type: 'logout' },
    ],
  };

  statusColor(status: string): string {
    return status === 'active' ? 'green' : 'red';
  }

  goSettings(): void {
    this.router.navigate(['/settings']);
  }
}
