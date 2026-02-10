import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-referral-detail-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './referral-profile.html',
  styleUrls: ['./referral-profile.scss'],
})
export class ReferralProfile {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  referralId = this.route.snapshot.paramMap.get('referralId');

  referral = {
    id: this.referralId || '1',
    referralId: 'REF-2026-001234',
    patientName: 'John Mwanza',
    patientId: 'PT-789456',
    age: 52,
    gender: 'Male',
    phoneNumber: '+255 712 345 678',
    referringFacility: 'Mwananyamala Hospital',
    referringDoctor: 'Dr. Amina Moshi',
    referringDoctorContact: '+255 755 123 456',
    receivingFacility: 'Muhimbili National Hospital',
    receivingDoctor: 'Dr. James Makoni',
    receivingDoctorContact: '+255 765 234 567',
    referralDate: '2026-02-01',
    appointmentDate: '2026-02-10',
    reason: 'Suspected cardiac condition requiring specialist evaluation',
    clinicalSummary:
      'Patient presents with chest pain, shortness of breath, and irregular heartbeat. ECG shows abnormalities. Blood pressure elevated at 160/95. Requires urgent cardiology consultation for further investigation and management.',
    diagnosis: 'Suspected Atrial Fibrillation',
    investigations: [
      'ECG - Abnormal rhythm detected',
      'Blood Pressure - 160/95 mmHg',
      'Complete Blood Count - Normal',
      'Lipid Profile - Elevated cholesterol',
    ],
    medications: [
      'Aspirin 100mg daily',
      'Metoprolol 50mg twice daily',
      'Atorvastatin 20mg at night',
    ],
    priority: 'urgent',
    status: 'accepted',
    specialty: 'Cardiology',
    region: 'Dar es Salaam',
    attachments: ['ECG Report - 2026-02-01.pdf', 'Blood Test Results - 2026-01-30.pdf'],
    timeline: [
      {
        date: '2026-02-01 09:30',
        status: 'created',
        description: 'Referral created by Dr. Amina Moshi',
        color: 'blue',
      },
      {
        date: '2026-02-01 14:20',
        status: 'sent',
        description: 'Referral sent to Muhimbili National Hospital',
        color: 'blue',
      },
      {
        date: '2026-02-02 10:15',
        status: 'accepted',
        description: 'Referral accepted by Dr. James Makoni',
        color: 'green',
      },
      {
        date: '2026-02-02 10:30',
        status: 'scheduled',
        description: 'Appointment scheduled for 2026-02-10 at 14:00',
        color: 'green',
      },
    ],
  };

  constructor() {}

  back(): void {
    this.router.navigate(['/shared-health-records/referrals']);
  }

  priorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'normal':
        return 'blue';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  }

  statusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'gold';
      case 'accepted':
        return 'blue';
      case 'completed':
        return 'green';
      case 'rejected':
        return 'red';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  }
}
