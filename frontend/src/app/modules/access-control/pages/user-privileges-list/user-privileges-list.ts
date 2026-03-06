import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { RolesService } from '../../services/roles.service';
import { Privilege } from '../../interfaces/access-control.interfaces';


@Component({
  selector: 'app-user-privileges-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './user-privileges-list.html',
  styleUrls: ['./user-privileges-list.scss'],
})
export class UserPrivilegesList {
  private readonly router: Router = inject(Router);
  private readonly rolesService = inject(RolesService);
  searchText = '';

  privileges = signal<Privilege[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.getPrivileges();
  }

  getPrivileges(): void {
    this.rolesService.getPrivileges().subscribe({
      next: (response: any) => {
        this.privileges.set(response);
      },
      error: (error) => {
        console.error("Failed to load privileges:", error);
      }
    }); 
  }

  editPrivilege(privilege: Privilege): void {
    this.router.navigate(['/access-control/user-privileges', privilege.uuid, 'edit']);
  }

  backToUsers(): void {
    this.router.navigate(['/access-control/users']);
  }
}
