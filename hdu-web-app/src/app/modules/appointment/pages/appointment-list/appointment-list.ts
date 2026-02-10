import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';

interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  department: string;
  provider: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  facility: string;
  reason: string;
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    clientId: 'CL-001234',
    clientName: 'Amina Hassan',
    appointmentDate: '2026-01-30',
    appointmentTime: '09:00',
    appointmentType: 'Consultation',
    department: 'General Medicine',
    provider: 'Dr. John Mwangi',
    status: 'confirmed',
    facility: 'Muhimbili National Hospital',
    reason: 'Follow-up checkup',
    notes: 'Patient requested morning slot',
  },
  {
    id: 'apt-002',
    clientId: 'CL-001235',
    clientName: 'Joseph Kabila',
    appointmentDate: '2026-01-30',
    appointmentTime: '10:30',
    appointmentType: 'Lab Test',
    department: 'Laboratory',
    provider: 'Lab Team',
    status: 'scheduled',
    facility: 'Mwananyamala Hospital',
    reason: 'Blood test',
  },
  {
    id: 'apt-003',
    clientId: 'CL-001236',
    clientName: 'Grace Ndege',
    appointmentDate: '2026-01-31',
    appointmentTime: '14:00',
    appointmentType: 'Surgery',
    department: 'Surgery',
    provider: 'Dr. Sarah Kimathi',
    status: 'confirmed',
    facility: 'Muhimbili National Hospital',
    reason: 'Minor surgery procedure',
  },
  {
    id: 'apt-004',
    clientId: 'CL-001237',
    clientName: 'Michael Nyerere',
    appointmentDate: '2026-01-29',
    appointmentTime: '11:00',
    appointmentType: 'Consultation',
    department: 'Cardiology',
    provider: 'Dr. James Oloo',
    status: 'completed',
    facility: 'Aga Khan Hospital',
    reason: 'Cardiac checkup',
  },
  {
    id: 'apt-005',
    clientId: 'CL-001238',
    clientName: 'Fatuma Ali',
    appointmentDate: '2026-01-28',
    appointmentTime: '15:30',
    appointmentType: 'Consultation',
    department: 'Pediatrics',
    provider: 'Dr. Mary Wanjiku',
    status: 'no-show',
    facility: 'Mwananyamala Hospital',
    reason: 'Child wellness visit',
  },
];

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss'],
})
export class AppointmentList {
  private readonly router: Router = inject(Router);
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly message: NzMessageService = inject(NzMessageService);
  searchText = '';
  selectedStatus = '';
  selectedDepartment = '';
  filteredAppointments = [...mockAppointments];
  isModalVisible = false;

  form = this.fb.group({
    clientId: ['', [Validators.required]],
    date: [null, [Validators.required]],
    time: [null, [Validators.required]],
    type: [null, [Validators.required]],
    department: [null, [Validators.required]],
    provider: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    notes: [''],
  });

  constructor() {}

  handleSearch(value: any): void {
    this.searchText = value;
    this.filterAppointments(value, this.selectedStatus, this.selectedDepartment);
  }

  handleStatusFilter(value: any | null): void {
    this.selectedStatus = value ?? '';
    this.filterAppointments(this.searchText, this.selectedStatus, this.selectedDepartment);
  }

  handleDepartmentFilter(value: any | null): void {
    this.selectedDepartment = value ?? '';
    this.filterAppointments(this.searchText, this.selectedStatus, this.selectedDepartment);
  }

  filterAppointments(search: string, status: string, department: string): void {
    let filtered = mockAppointments;

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.clientName.toLowerCase().includes(lower) ||
          appointment.clientId.toLowerCase().includes(lower) ||
          appointment.provider.toLowerCase().includes(lower),
      );
    }

    if (status) {
      filtered = filtered.filter((appointment) => appointment.status === status);
    }

    if (department) {
      filtered = filtered.filter((appointment) => appointment.department === department);
    }

    this.filteredAppointments = filtered;
  }

  statusColor(status: string): string {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'confirmed':
        return 'green';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'red';
      case 'no-show':
        return 'orange';
      default:
        return 'default';
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.form.reset();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.message.success('Appointment scheduled successfully');
    this.closeModal();
  }

  view(id: string): void {
    this.router.navigate(['/appointments', id]);
  }

  get todayAppointments(): number {
    return mockAppointments.filter(
      (apt) => new Date(apt.appointmentDate).toDateString() === new Date().toDateString(),
    ).length;
  }

  get confirmedAppointments(): number {
    return mockAppointments.filter((apt) => apt.status === 'confirmed').length;
  }

  get completedAppointments(): number {
    return mockAppointments.filter((apt) => apt.status === 'completed').length;
  }

  get noShowAppointments(): number {
    return mockAppointments.filter((apt) => apt.status === 'no-show').length;
  }
}
