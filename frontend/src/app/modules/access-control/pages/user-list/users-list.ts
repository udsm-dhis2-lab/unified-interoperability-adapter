import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { UsersService } from '../../services/users.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { debounceTime, Observable, Subject, switchMap } from 'rxjs';

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
export class UsersList implements OnDestroy{
  usersService = inject(UsersService);
  users: User[] = []
  loadingUsers = signal(false);
  total = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  filterKey = [{}];
  isFirstLoad = true;

  searchText = '';
  roleFilter = 'all';
  statusFilter = 'all';

  searchSubject = new Subject<void>();

  constructor(private readonly router: Router) {}

  ngOnInit(){
    this.getUsers();

    this.searchSubject.pipe(
      debounceTime(500),
      switchMap(() => {
        this.loadingUsers.set(true);
        return this.usersService.getUsers(undefined,{
          page: this.pageIndex(),
          pageSize: this.pageSize(),
          search: this.searchText
        });
      })
    ).subscribe({
      next: (response: any) => {
        this.users = response?.users;
        this.loadingUsers.set(false);
      },
      error: () => {
        this.loadingUsers.set(false)
      }
    })
  }

  getUsers(){
    this.loadingUsers.set(true);
    this.usersService.getUsers(undefined, {
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      search: this.searchText
    }).subscribe({
      next: (response: any) => {
        this.users = response?.users;
      },
      complete: () => {
        this.loadingUsers.set(false);
      }
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex } = params;
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);

    this.getUsers();
  }

  onSearchUser(e: any){
    e?.stopPropagation();

    this.searchText = e?.target?.value;

    this.searchSubject.next();
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

  ngOnDestroy(){
    this.searchSubject.unsubscribe();
  }
}
