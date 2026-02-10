import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.scss'],
})
export class UserCreate {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
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
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    role: [null, [Validators.required]],
    department: ['', [Validators.required]],
    facility: [null, [Validators.required]],
    region: [null, [Validators.required]],
    authorities: [[] as string[]],
    status: [true],
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
