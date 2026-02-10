import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { mockClients } from 'src/app/core/data/mock-data';
import { format } from 'date-fns';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, RouterModule, ...ZORRO_MODULES],
  templateUrl: './client-profile.html',
  styleUrls: ['./client-profile.scss'],
})
export class ClientProfile {
  clientId: string | null;

  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  client = mockClients.find((c) => c.id === this.route.snapshot.paramMap.get('clientId')) || null;

  visitHistory = [
    {
      date: '2024-01-20',
      facility: 'Muhimbili Hospital',
      reason: 'Routine Checkup',
      doctor: 'Dr. Mwangi',
    },
    {
      date: '2023-12-15',
      facility: 'Dar Health Center',
      reason: 'Vaccination',
      doctor: 'Dr. Kamau',
    },
    {
      date: '2023-11-08',
      facility: 'Muhimbili Hospital',
      reason: 'Follow-up',
      doctor: 'Dr. Mwangi',
    },
  ];

  activityLog = [
    { time: '2024-01-24 10:30', action: 'Profile Updated', user: 'Admin User' },
    { time: '2024-01-20 14:15', action: 'Medical Record Added', user: 'Dr. Mwangi' },
    { time: '2024-01-15 10:30', action: 'Client Registered', user: 'Receptionist' },
  ];

  constructor() {
    this.clientId = this.route.snapshot.paramMap.get('clientId');

    console.log(`Client ID from route: ${this.route.snapshot.paramMap.get('clientId')}`);
  }

  formatDate(date: string): string {
    return format(new Date(date), 'dd MMM yyyy');
  }

  formatDateTime(date: string): string {
    return format(new Date(date), 'dd MMM yyyy, HH:mm');
  }

  ageFromDob(date: string): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  back(): void {
    this.router.navigate(['/clients']);
  }

  goToDeduplication(): void {
    this.router.navigate(['/deduplication']);
  }
}
