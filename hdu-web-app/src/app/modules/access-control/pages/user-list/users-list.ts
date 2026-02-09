import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface User {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  facility: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
  authorities: string[];
}

const mockUsers: User[] = [
  {
    id: '1',
    userId: 'USR-001',
    firstName: 'Amina',
    lastName: 'Mwakasege',
    email: 'amina.mwakasege@health.go.tz',
    phoneNumber: '+255 755 123 456',
    role: 'Health Professional',
    department: 'Cardiology',
    facility: 'Muhimbili National Hospital',
    status: 'active',
    lastLogin: '2026-02-04 08:30',
    createdDate: '2025-06-15',
    authorities: ['VIEW_PATIENTS', 'EDIT_PATIENTS', 'VIEW_RECORDS', 'MANAGE_APPOINTMENTS'],
  },
  {
    id: '2',
    userId: 'USR-002',
    firstName: 'James',
    lastName: 'Makoni',
    email: 'james.makoni@health.go.tz',
    phoneNumber: '+255 765 234 567',
    role: 'System Administrator',
    department: 'IT Department',
    facility: 'Ministry of Health',
    status: 'active',
    lastLogin: '2026-02-04 09:15',
    createdDate: '2025-04-10',
    authorities: [
      'FULL_ACCESS',
      'MANAGE_USERS',
      'MANAGE_ROLES',
      'VIEW_AUDIT_LOGS',
      'SYSTEM_CONFIG',
    ],
  },
  {
    id: '3',
    userId: 'USR-003',
    firstName: 'Sarah',
    lastName: 'Kimambo',
    email: 'sarah.kimambo@health.go.tz',
    phoneNumber: '+255 712 345 678',
    role: 'Data Analyst',
    department: 'Health Information',
    facility: 'Ministry of Health',
    status: 'active',
    lastLogin: '2026-02-03 16:45',
    createdDate: '2025-08-20',
    authorities: ['VIEW_REPORTS', 'EXPORT_DATA', 'VIEW_ANALYTICS'],
  },
  {
    id: '4',
    userId: 'USR-004',
    firstName: 'Peter',
    lastName: 'Ndunguru',
    email: 'peter.ndunguru@health.go.tz',
    phoneNumber: '+255 754 987 654',
    role: 'Health Professional',
    department: 'Emergency Medicine',
    facility: 'Mwananyamala Hospital',
    status: 'active',
    lastLogin: '2026-02-04 07:20',
    createdDate: '2025-07-05',
    authorities: ['VIEW_PATIENTS', 'EDIT_PATIENTS', 'VIEW_RECORDS'],
  },
  {
    id: '5',
    userId: 'USR-005',
    firstName: 'Lucy',
    lastName: 'Maige',
    email: 'lucy.maige@health.go.tz',
    phoneNumber: '+255 713 456 789',
    role: 'Receptionist',
    department: 'Front Desk',
    facility: 'Temeke Regional Hospital',
    status: 'inactive',
    lastLogin: '2026-01-28 17:30',
    createdDate: '2025-09-12',
    authorities: ['VIEW_PATIENTS', 'SCHEDULE_APPOINTMENTS'],
  },
  {
    id: '6',
    userId: 'USR-006',
    firstName: 'Emmanuel',
    lastName: 'Lyimo',
    email: 'emmanuel.lyimo@health.go.tz',
    phoneNumber: '+255 767 890 123',
    role: 'Health Professional',
    department: 'Pediatrics',
    facility: 'Kilimanjaro Christian Medical Centre',
    status: 'suspended',
    lastLogin: '2026-01-15 14:20',
    createdDate: '2025-05-30',
    authorities: ['VIEW_PATIENTS', 'VIEW_RECORDS'],
  },
];

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList {
  searchText = '';
  roleFilter = 'all';
  statusFilter = 'all';

  constructor(private readonly router: Router) {}

  get filteredUsers(): User[] {
    return mockUsers.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.userId.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'all' || user.status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  get stats() {
    return {
      total: mockUsers.length,
      active: mockUsers.filter((u) => u.status === 'active').length,
      inactive: mockUsers.filter((u) => u.status === 'inactive').length,
      suspended: mockUsers.filter((u) => u.status === 'suspended').length,
    };
  }

  editUser(userId: string): void {
    this.router.navigate(['/access-control/users', userId, 'edit']);
  }

  goRoles(): void {
    this.router.navigate(['/access-control/user-roles']);
  }

  goAuthorities(): void {
    this.router.navigate(['/access-control/user-authorities']);
  }

  createUser(): void {
    this.router.navigate(['/access-control/users/create']);
  }

  roleColor(role: string): string {
    switch (role) {
      case 'System Administrator':
        return 'purple';
      case 'Health Professional':
        return 'blue';
      case 'Data Analyst':
        return 'cyan';
      case 'Receptionist':
        return 'orange';
      default:
        return 'default';
    }
  }
}
