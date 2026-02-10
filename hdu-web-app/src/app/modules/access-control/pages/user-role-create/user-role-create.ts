import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface AuthorityGroup {
  category: string;
  permissions: {
    code: string;
    name: string;
    description: string;
    risk: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

@Component({
  selector: 'app-user-role-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './user-role-create.html',
  styleUrls: ['./user-role-create.scss'],
})
export class UserRoleCreate {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  constructor() {}
  allAuthorities: AuthorityGroup[] = [
    {
      category: 'Patient Management',
      permissions: [
        {
          code: 'VIEW_PATIENTS',
          name: 'View Patients',
          description: 'View patient demographic information',
          risk: 'low',
        },
        {
          code: 'EDIT_PATIENTS',
          name: 'Edit Patients',
          description: 'Modify patient demographic information',
          risk: 'medium',
        },
        {
          code: 'DELETE_PATIENTS',
          name: 'Delete Patients',
          description: 'Delete patient records',
          risk: 'critical',
        },
        {
          code: 'MANAGE_REFERRALS',
          name: 'Manage Referrals',
          description: 'Create and manage patient referrals',
          risk: 'medium',
        },
      ],
    },
    {
      category: 'Health Records',
      permissions: [
        {
          code: 'VIEW_RECORDS',
          name: 'View Health Records',
          description: 'View patient health records',
          risk: 'medium',
        },
        {
          code: 'EDIT_RECORDS',
          name: 'Edit Health Records',
          description: 'Modify patient health records',
          risk: 'high',
        },
        {
          code: 'DELETE_RECORDS',
          name: 'Delete Health Records',
          description: 'Delete health records',
          risk: 'critical',
        },
      ],
    },
    {
      category: 'Appointments & Scheduling',
      permissions: [
        {
          code: 'MANAGE_APPOINTMENTS',
          name: 'Manage Appointments',
          description: 'Create and manage appointments',
          risk: 'low',
        },
        {
          code: 'SCHEDULE_APPOINTMENTS',
          name: 'Schedule Appointments',
          description: 'Schedule patient appointments',
          risk: 'low',
        },
        {
          code: 'CANCEL_APPOINTMENTS',
          name: 'Cancel Appointments',
          description: 'Cancel appointments',
          risk: 'medium',
        },
      ],
    },
    {
      category: 'Analytics & Reporting',
      permissions: [
        {
          code: 'VIEW_REPORTS',
          name: 'View Reports',
          description: 'Access system reports',
          risk: 'low',
        },
        {
          code: 'EXPORT_DATA',
          name: 'Export Data',
          description: 'Export data and reports',
          risk: 'high',
        },
        {
          code: 'VIEW_ANALYTICS',
          name: 'View Analytics',
          description: 'Access analytics dashboards',
          risk: 'low',
        },
      ],
    },
    {
      category: 'System Administration',
      permissions: [
        {
          code: 'MANAGE_USERS',
          name: 'Manage Users',
          description: 'Create and modify user accounts',
          risk: 'critical',
        },
        {
          code: 'MANAGE_ROLES',
          name: 'Manage Roles',
          description: 'Create and modify user roles',
          risk: 'critical',
        },
        {
          code: 'VIEW_AUDIT_LOGS',
          name: 'View Audit Logs',
          description: 'View system audit logs',
          risk: 'high',
        },
        {
          code: 'SYSTEM_CONFIG',
          name: 'System Configuration',
          description: 'Modify system configuration',
          risk: 'critical',
        },
        {
          code: 'FULL_ACCESS',
          name: 'Full Access',
          description: 'Complete system access',
          risk: 'critical',
        },
      ],
    },
    {
      category: 'API & Integration',
      permissions: [
        { code: 'API_ACCESS', name: 'API Access', description: 'Access system APIs', risk: 'high' },
        {
          code: 'INTEGRATION_MANAGEMENT',
          name: 'Integration Management',
          description: 'Manage system integrations',
          risk: 'high',
        },
      ],
    },
  ];

  form = this.fb.group({
    roleName: ['', [Validators.required]],
    description: ['', [Validators.required]],
    category: [''],
    status: [true],
    authorities: [[] as string[]],
  });

  riskColor(risk: string): string {
    switch (risk) {
      case 'low':
        return 'green';
      case 'medium':
        return 'blue';
      case 'high':
        return 'orange';
      case 'critical':
        return 'red';
      default:
        return 'default';
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.router.navigate(['/roles']);
  }

  cancel(): void {
    this.router.navigate(['/roles']);
  }
}
