import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface Authority {
  id: string;
  authorityId: string;
  authorityName: string;
  authorityCode: string;
  description: string;
  category:
    | 'Patient Management'
    | 'Health Records'
    | 'Appointments'
    | 'Analytics'
    | 'System Administration'
    | 'API & Integration';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  rolesCount: number;
  usersCount: number;
  status: 'active' | 'inactive';
  createdDate: string;
}

const mockAuthorities: Authority[] = [
  {
    id: '1',
    authorityId: 'AUTH-001',
    authorityName: 'View Patients',
    authorityCode: 'VIEW_PATIENTS',
    description: 'Permission to view patient demographic information and basic details',
    category: 'Patient Management',
    riskLevel: 'low',
    rolesCount: 6,
    usersCount: 95,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '2',
    authorityId: 'AUTH-002',
    authorityName: 'Edit Patients',
    authorityCode: 'EDIT_PATIENTS',
    description: 'Permission to modify patient demographic information and personal details',
    category: 'Patient Management',
    riskLevel: 'medium',
    rolesCount: 2,
    usersCount: 48,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '3',
    authorityId: 'AUTH-003',
    authorityName: 'Delete Patients',
    authorityCode: 'DELETE_PATIENTS',
    description: 'Permission to delete patient records (restricted to administrators)',
    category: 'Patient Management',
    riskLevel: 'critical',
    rolesCount: 1,
    usersCount: 3,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '4',
    authorityId: 'AUTH-004',
    authorityName: 'View Health Records',
    authorityCode: 'VIEW_RECORDS',
    description: 'Permission to view patient health records including clinical data',
    category: 'Health Records',
    riskLevel: 'medium',
    rolesCount: 5,
    usersCount: 78,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '5',
    authorityId: 'AUTH-005',
    authorityName: 'Edit Health Records',
    authorityCode: 'EDIT_RECORDS',
    description: 'Permission to modify and update patient health records',
    category: 'Health Records',
    riskLevel: 'high',
    rolesCount: 2,
    usersCount: 45,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '6',
    authorityId: 'AUTH-006',
    authorityName: 'Manage Appointments',
    authorityCode: 'MANAGE_APPOINTMENTS',
    description: 'Permission to create, modify, and cancel patient appointments',
    category: 'Appointments',
    riskLevel: 'low',
    rolesCount: 3,
    usersCount: 67,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '7',
    authorityId: 'AUTH-007',
    authorityName: 'Manage Referrals',
    authorityCode: 'MANAGE_REFERRALS',
    description: 'Permission to create and manage patient referrals between facilities',
    category: 'Patient Management',
    riskLevel: 'medium',
    rolesCount: 2,
    usersCount: 45,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '8',
    authorityId: 'AUTH-008',
    authorityName: 'View Reports',
    authorityCode: 'VIEW_REPORTS',
    description: 'Permission to access and view system reports and analytics',
    category: 'Analytics',
    riskLevel: 'low',
    rolesCount: 2,
    usersCount: 11,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '9',
    authorityId: 'AUTH-009',
    authorityName: 'Export Data',
    authorityCode: 'EXPORT_DATA',
    description: 'Permission to export data and reports from the system',
    category: 'Analytics',
    riskLevel: 'high',
    rolesCount: 2,
    usersCount: 11,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '10',
    authorityId: 'AUTH-010',
    authorityName: 'View Analytics',
    authorityCode: 'VIEW_ANALYTICS',
    description: 'Permission to access analytics dashboards and insights',
    category: 'Analytics',
    riskLevel: 'low',
    rolesCount: 2,
    usersCount: 11,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '11',
    authorityId: 'AUTH-011',
    authorityName: 'Manage Users',
    authorityCode: 'MANAGE_USERS',
    description: 'Permission to create, modify, and deactivate user accounts',
    category: 'System Administration',
    riskLevel: 'critical',
    rolesCount: 1,
    usersCount: 3,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '12',
    authorityId: 'AUTH-012',
    authorityName: 'Manage Roles',
    authorityCode: 'MANAGE_ROLES',
    description: 'Permission to create and modify user roles and permissions',
    category: 'System Administration',
    riskLevel: 'critical',
    rolesCount: 1,
    usersCount: 3,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '13',
    authorityId: 'AUTH-013',
    authorityName: 'View Audit Logs',
    authorityCode: 'VIEW_AUDIT_LOGS',
    description: 'Permission to view system audit logs and security events',
    category: 'System Administration',
    riskLevel: 'high',
    rolesCount: 1,
    usersCount: 3,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '14',
    authorityId: 'AUTH-014',
    authorityName: 'System Configuration',
    authorityCode: 'SYSTEM_CONFIG',
    description: 'Permission to modify system configuration and settings',
    category: 'System Administration',
    riskLevel: 'critical',
    rolesCount: 1,
    usersCount: 3,
    status: 'active',
    createdDate: '2025-01-10',
  },
  {
    id: '15',
    authorityId: 'AUTH-015',
    authorityName: 'API Access',
    authorityCode: 'API_ACCESS',
    description: 'Permission to access and use system APIs for integration',
    category: 'API & Integration',
    riskLevel: 'high',
    rolesCount: 2,
    usersCount: 8,
    status: 'active',
    createdDate: '2025-01-10',
  },
];

@Component({
  selector: 'app-user-permissions-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './user-permissions-list.html',
  styleUrls: ['./user-permissions-list.scss'],
})
export class UserAuthorityList {
  private readonly router: Router = inject(Router);
  searchText = '';
  categoryFilter = 'all';
  riskFilter = 'all';

  constructor() {}

  get filteredAuthorities(): Authority[] {
    return mockAuthorities.filter((authority) => {
      const matchesSearch =
        authority.authorityName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        authority.authorityCode.toLowerCase().includes(this.searchText.toLowerCase()) ||
        authority.description.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesCategory =
        this.categoryFilter === 'all' || authority.category === this.categoryFilter;
      const matchesRisk = this.riskFilter === 'all' || authority.riskLevel === this.riskFilter;
      return matchesSearch && matchesCategory && matchesRisk;
    });
  }

  get stats() {
    return {
      total: mockAuthorities.length,
      active: mockAuthorities.filter((a) => a.status === 'active').length,
      critical: mockAuthorities.filter((a) => a.riskLevel === 'critical').length,
      highRisk: mockAuthorities.filter((a) => a.riskLevel === 'high').length,
    };
  }

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

  categoryColor(category: string): string {
    switch (category) {
      case 'Patient Management':
        return 'blue';
      case 'Health Records':
        return 'purple';
      case 'Appointments':
        return 'cyan';
      case 'Analytics':
        return 'green';
      case 'System Administration':
        return 'red';
      case 'API & Integration':
        return 'orange';
      default:
        return 'default';
    }
  }

  createAuthority(): void {
    this.router.navigate(['/access-control/user-authorities/create']);
  }

  backToUsers(): void {
    this.router.navigate(['/access-control/users']);
  }
}
