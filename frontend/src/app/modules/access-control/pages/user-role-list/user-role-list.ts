import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { RolesService } from '../../services/roles.service';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface Role {
  uuid: string;
  roleName: string;
  description?: string;
  privileges: string[];
}

@Component({
  selector: 'app-user-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './user-role-list.html',
  styleUrls: ['./user-role-list.scss'],
})
export class UserRoleList {
  rolesService = inject(RolesService);
  searchText = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  
  loadingRoles = signal(false);
  total = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  roles: Role[] = []

  searchSubject = new Subject<void>();

  constructor(private readonly router: Router) {}

  ngOnInit(){
    this.getRoles()

    this.searchSubject.pipe(
          debounceTime(500),
          tap(() => {
            this.getRoles()
          })
        ).subscribe();
  }

  onSearchRole(e: any){
    e?.stopPropagation();

    this.searchText = e?.target?.value;

    this.searchSubject.next();
  }

  getRoles(){
    this.loadingRoles.set(true);
    this.rolesService.getRoles({
      page: this.pageIndex(),
      pageSize: this.pageSize(),
      search: this.searchText
    }).subscribe({
      next: (response: any) => {
        this.roles = response?.roles;
      },
      complete: () => {
        this.loadingRoles.set(false);
      }
    })
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);

    this.getRoles();
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
