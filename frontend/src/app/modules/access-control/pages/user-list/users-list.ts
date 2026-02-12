import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { UsersService } from '../../services/users.service';

interface User {
  uuid: string;
  username: string;
  firstName: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  disabled?: Boolean;
  authorities?: string[];
  roles?: UserRole[];
  lastLogin?: String;
}

interface UserRole {
  roleName: string;
  uuid: string;
}


@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList {
  usersService = inject(UsersService);
  users: User[] = []
  loadingUsers = signal(false);

  searchText = '';
  roleFilter = 'all';
  statusFilter = 'all';

  constructor(private readonly router: Router) {}

  ngOnInit(){
    console.log("Calling users")
    this.getUsers();
  }

  getUsers(){
    this.loadingUsers.set(true);
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response?.users;
      },
      complete: () => {
        this.loadingUsers.set(false);
      }
    })
  }

  get filteredUsers(): User[] {
    return this.users.filter((user) => {
      const matchesSearch =
        user?.firstName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user?.surname?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user?.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user?.username?.toLowerCase().includes(this.searchText.toLowerCase());
      // const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      // const matchesStatus = this.statusFilter === 'all' || user.disabled === this.statusFilter;
      return matchesSearch // && matchesRole && matchesStatus;
    });
  }

  get stats() {
    return {
      total: this.users.length,
      active: this.users.filter((u) => !u.disabled).length,
      inactive: this.users.filter((u) => u.disabled).length,
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
