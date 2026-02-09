import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.scss'],
})
export class UserEdit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  userId = this.route.snapshot.paramMap.get('userId');

  user = {
    id: this.userId || '1',
    userId: 'USR-001',
    firstName: 'Amina',
    lastName: 'Mwakasege',
    email: 'amina.mwakasege@health.go.tz',
    phoneNumber: '+255 755 123 456',
    role: 'Health Professional',
    department: 'Cardiology',
    facility: 'Muhimbili National Hospital',
    region: 'Dar es Salaam',
    status: 'active',
    authorities: ['VIEW_PATIENTS', 'EDIT_PATIENTS', 'VIEW_RECORDS', 'MANAGE_APPOINTMENTS'],
    createdDate: '2025-06-15',
    lastLogin: '2026-02-04 08:30',
  };

  allAuthorities = [
    { value: 'VIEW_PATIENTS', label: 'View Patients' },
    { value: 'EDIT_PATIENTS', label: 'Edit Patients' },
    { value: 'DELETE_PATIENTS', label: 'Delete Patients' },
    { value: 'VIEW_RECORDS', label: 'View Health Records' },
    { value: 'EDIT_RECORDS', label: 'Edit Health Records' },
    { value: 'MANAGE_APPOINTMENTS', label: 'Manage Appointments' },
    { value: 'MANAGE_REFERRALS', label: 'Manage Referrals' },
    { value: 'VIEW_REPORTS', label: 'View Reports' },
    { value: 'EXPORT_DATA', label: 'Export Data' },
    { value: 'VIEW_ANALYTICS', label: 'View Analytics' },
    { value: 'MANAGE_USERS', label: 'Manage Users' },
    { value: 'MANAGE_ROLES', label: 'Manage Roles' },
    { value: 'VIEW_AUDIT_LOGS', label: 'View Audit Logs' },
    { value: 'SYSTEM_CONFIG', label: 'System Configuration' },
    { value: 'API_ACCESS', label: 'API Access' },
  ];

  form = this.fb.group({
    firstName: [this.user.firstName, [Validators.required]],
    lastName: [this.user.lastName, [Validators.required]],
    email: [this.user.email, [Validators.required, Validators.email]],
    phoneNumber: [this.user.phoneNumber, [Validators.required]],
    userId: [this.user.userId],
    role: [this.user.role, [Validators.required]],
    department: [this.user.department, [Validators.required]],
    facility: [this.user.facility, [Validators.required]],
    region: [this.user.region, [Validators.required]],
    authorities: [this.user.authorities],
    status: [this.user.status],
  });

  constructor() {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.router.navigate(['/access-control/users']);
  }

  cancel(): void {
    this.router.navigate(['/access-control/users']);
  }
}
