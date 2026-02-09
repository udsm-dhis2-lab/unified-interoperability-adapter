import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-appointment-detail-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './appointment-detail-page.component.html',
  styleUrls: ['./appointment-detail-page.component.scss'],
})
export class AppointmentProfile {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  appointmentId = this.route.snapshot.paramMap.get('appointmentId');

  appointment = {
    id: this.appointmentId || '1',
    appointmentId: 'APT-2026-001234',
    patientName: 'Sarah Kamau',
    patientId: 'PT-123456',
    age: 34,
    gender: 'Female',
    phoneNumber: '+255 712 345 678',
    email: 'sarah.kamau@email.com',
    dateTime: '2026-02-10 09:00',
    date: '2026-02-10',
    time: '09:00',
    duration: '30 minutes',
    facility: 'Muhimbili National Hospital',
    department: 'Cardiology',
    doctor: 'Dr. James Makoni',
    doctorSpecialty: 'Cardiologist',
    doctorContact: '+255 765 234 567',
    room: 'Room 305, Building B',
    appointmentType: 'Follow-up',
    status: 'confirmed',
    reason: 'Follow-up consultation for cardiac condition',
    notes: 'Patient should bring previous ECG reports and medication list. Fasting not required.',
    referralId: 'REF-2026-001234',
    previousVisit: '2026-01-15',
    instructions: [
      'Arrive 15 minutes before appointment time',
      'Bring all current medications',
      'Bring previous test results and ECG reports',
      'Bring valid ID and insurance card',
    ],
    timeline: [
      {
        date: '2026-02-01 14:30',
        status: 'scheduled',
        description: 'Appointment scheduled',
        color: 'blue',
      },
      {
        date: '2026-02-03 10:15',
        status: 'confirmed',
        description: 'Appointment confirmed by patient',
        color: 'green',
      },
      {
        date: '2026-02-05 09:00',
        status: 'reminder',
        description: 'Reminder sent to patient',
        color: 'blue',
      },
    ],
  };

  constructor() {}

  back(): void {
    this.router.navigate(['/appointments']);
  }

  toReferral(): void {
    this.router.navigate(['/referrals', this.appointment.referralId]);
  }

  statusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'confirmed':
        return 'green';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'red';
      case 'no-show':
        return 'orange';
      default:
        return 'default';
    }
  }
}
