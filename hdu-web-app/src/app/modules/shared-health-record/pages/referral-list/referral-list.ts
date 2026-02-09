import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface Referral {
  id: string;
  referralId: string;
  patientName: string;
  patientId: string;
  referringFacility: string;
  referringDoctor: string;
  receivingFacility: string;
  receivingDoctor?: string;
  referralDate: string;
  appointmentDate?: string;
  reason: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled';
  specialty: string;
  region: string;
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    referralId: 'REF-2026-001234',
    patientName: 'John Mwanza',
    patientId: 'PT-789456',
    referringFacility: 'Mwananyamala Hospital',
    referringDoctor: 'Dr. Amina Moshi',
    receivingFacility: 'Muhimbili National Hospital',
    receivingDoctor: 'Dr. James Makoni',
    referralDate: '2026-02-01',
    appointmentDate: '2026-02-10',
    reason: 'Suspected cardiac condition requiring specialist evaluation',
    priority: 'urgent',
    status: 'accepted',
    specialty: 'Cardiology',
    region: 'Dar es Salaam',
  },
  {
    id: '2',
    referralId: 'REF-2026-001235',
    patientName: 'Grace Mollel',
    patientId: 'PT-456123',
    referringFacility: 'Temeke Regional Hospital',
    referringDoctor: 'Dr. Sarah Kimambo',
    receivingFacility: 'Ocean Road Cancer Institute',
    referralDate: '2026-02-02',
    reason: 'Suspected malignancy requiring biopsy and oncology consultation',
    priority: 'high',
    status: 'pending',
    specialty: 'Oncology',
    region: 'Dar es Salaam',
  },
  {
    id: '3',
    referralId: 'REF-2026-001236',
    patientName: 'Ahmed Hassan',
    patientId: 'PT-321654',
    referringFacility: 'Amana Regional Hospital',
    referringDoctor: 'Dr. Peter Ndunguru',
    receivingFacility: 'Muhimbili Orthopedic Institute',
    receivingDoctor: 'Dr. Lucy Maige',
    referralDate: '2026-01-28',
    appointmentDate: '2026-02-05',
    reason: 'Complex fracture requiring surgical intervention',
    priority: 'high',
    status: 'completed',
    specialty: 'Orthopedics',
    region: 'Dar es Salaam',
  },
  {
    id: '4',
    referralId: 'REF-2026-001237',
    patientName: 'Fatuma Juma',
    patientId: 'PT-987321',
    referringFacility: 'Kilimanjaro Christian Medical Centre',
    referringDoctor: 'Dr. Emmanuel Lyimo',
    receivingFacility: 'Muhimbili National Hospital',
    referralDate: '2026-02-03',
    reason: 'High-risk pregnancy requiring tertiary care',
    priority: 'urgent',
    status: 'accepted',
    specialty: 'Obstetrics & Gynecology',
    region: 'Kilimanjaro',
  },
  {
    id: '5',
    referralId: 'REF-2026-001238',
    patientName: 'Ibrahim Rashid',
    patientId: 'PT-654789',
    referringFacility: 'Mbeya Zonal Referral Hospital',
    referringDoctor: 'Dr. Anna Mwakibete',
    receivingFacility: 'Muhimbili National Hospital',
    referralDate: '2026-02-04',
    reason: 'Chronic kidney disease requiring nephrology consultation',
    priority: 'normal',
    status: 'pending',
    specialty: 'Nephrology',
    region: 'Mbeya',
  },
];

@Component({
  selector: 'app-referral-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './referral-list.html',
  styleUrls: ['./referral-list.scss'],
})
export class ReferralList {
  searchText = '';
  statusFilter = 'all';
  priorityFilter = 'all';

  constructor(private readonly router: Router) {}

  get filteredReferrals(): Referral[] {
    return mockReferrals.filter((referral) => {
      const matchesSearch =
        referral.referralId.toLowerCase().includes(this.searchText.toLowerCase()) ||
        referral.patientName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        referral.referringFacility.toLowerCase().includes(this.searchText.toLowerCase()) ||
        referral.receivingFacility.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus = this.statusFilter === 'all' || referral.status === this.statusFilter;
      const matchesPriority =
        this.priorityFilter === 'all' || referral.priority === this.priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  get stats() {
    return {
      total: mockReferrals.length,
      pending: mockReferrals.filter((r) => r.status === 'pending').length,
      accepted: mockReferrals.filter((r) => r.status === 'accepted').length,
      completed: mockReferrals.filter((r) => r.status === 'completed').length,
      urgent: mockReferrals.filter((r) => r.priority === 'urgent').length,
    };
  }

  view(referralId: string): void {
    this.router.navigate(['/shared-health-records/referrals', referralId]);
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
