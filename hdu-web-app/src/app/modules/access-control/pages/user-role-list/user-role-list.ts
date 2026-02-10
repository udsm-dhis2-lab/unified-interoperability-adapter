import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface Role {
  id: string;
  roleId: string;
  roleName: string;
  description: string;
  userCount: number;
  authorities: string[];
  status: 'active' | 'inactive';
  createdDate: string;
  modifiedDate: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    roleId: 'ROLE-001',
    roleName: 'System Administrator',
    description: 'Full system access with all administrative privileges',
    userCount: 3,
    authorities: [
      'FULL_ACCESS',
      'MANAGE_USERS',
      'MANAGE_ROLES',
      'VIEW_AUDIT_LOGS',
      'SYSTEM_CONFIG',
      'API_ACCESS',
    ],
    status: 'active',
    createdDate: '2025-01-10',
    modifiedDate: '2025-12-15',
  },
  {
    id: '2',
    roleId: 'ROLE-002',
    roleName: 'Health Professional',
    description: 'Healthcare providers with patient care and clinical data access',
    userCount: 45,
    authorities: [
      'VIEW_PATIENTS',
      'EDIT_PATIENTS',
      'VIEW_RECORDS',
      'EDIT_RECORDS',
      'MANAGE_APPOINTMENTS',
      'MANAGE_REFERRALS',
    ],
    status: 'active',
    createdDate: '2025-01-10',
    modifiedDate: '2026-01-20',
  },
  {
    id: '3',
    roleId: 'ROLE-003',
    roleName: 'Data Analyst',
    description: 'Access to analytics, reports, and data export functionality',
    userCount: 8,
    authorities: ['VIEW_PATIENTS', 'VIEW_RECORDS', 'VIEW_REPORTS', 'EXPORT_DATA', 'VIEW_ANALYTICS'],
    status: 'active',
    createdDate: '2025-01-10',
    modifiedDate: '2025-11-05',
  },
  {
    id: '4',
    roleId: 'ROLE-004',
    roleName: 'Receptionist',
    description: 'Front desk staff with appointment and basic patient management access',
    userCount: 22,
    authorities: ['VIEW_PATIENTS', 'SCHEDULE_APPOINTMENTS', 'BASIC_PATIENT_INFO'],
    status: 'active',
    createdDate: '2025-01-10',
    modifiedDate: '2025-09-18',
  },
  {
    id: '5',
    roleId: 'ROLE-005',
    roleName: 'Laboratory Technician',
    description: 'Access to laboratory results and test management',
    userCount: 15,
    authorities: ['VIEW_PATIENTS', 'VIEW_RECORDS', 'MANAGE_LAB_RESULTS', 'UPLOAD_LAB_REPORTS'],
    status: 'active',
    createdDate: '2025-02-14',
    modifiedDate: '2025-10-22',
  },
  {
    id: '6',
    roleId: 'ROLE-006',
    roleName: 'Pharmacist',
    description: 'Pharmacy staff with medication and prescription access',
    userCount: 12,
    authorities: ['VIEW_PATIENTS', 'VIEW_RECORDS', 'MANAGE_PRESCRIPTIONS', 'DISPENSE_MEDICATION'],
    status: 'active',
    createdDate: '2025-02-14',
    modifiedDate: '2025-12-01',
  },
  {
    id: '7',
    roleId: 'ROLE-007',
    roleName: 'Read-Only User',
    description: 'View-only access to patient and health records',
    userCount: 5,
    authorities: ['VIEW_PATIENTS', 'VIEW_RECORDS'],
    status: 'inactive',
    createdDate: '2025-03-20',
    modifiedDate: '2025-08-15',
  },
];

@Component({
  selector: 'app-user-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './user-role-list.html',
  styleUrls: ['./user-role-list.scss'],
})
export class UserRoleList {
  searchText = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  constructor(private readonly router: Router) {}

  get filteredRoles(): Role[] {
    return mockRoles.filter((role) => {
      const matchesSearch =
        role.roleName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        role.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
        role.roleId.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || role.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get stats() {
    return {
      total: mockRoles.length,
      active: mockRoles.filter((r) => r.status === 'active').length,
      inactive: mockRoles.filter((r) => r.status === 'inactive').length,
      totalUsers: mockRoles.reduce((sum, role) => sum + role.userCount, 0),
    };
  }

  goAuthorities(): void {
    this.router.navigate(['/access-control/user-authorities']);
  }

  createRole(): void {
    this.router.navigate(['/access-control/user-roles/create']);
  }

  editRole(roleId: string): void {
    this.router.navigate(['/access-control/user-roles', roleId, 'edit']);
  }
}
