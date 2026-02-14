import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { RolesService } from '../../services/roles.service';

interface AuthorityGroup {
  uuid?: string;
  roleName: string;
  description?: string;
  privileges: {
    uuid: string;
    privilegeName: string;
    description: string;
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
  private readonly rolesService = inject(RolesService);

  privileges: any[] = []
  constructor() {}

  save(): void {
    this.router.navigate(['/roles']);
  }

  cancel(): void {
    this.router.navigate(['/roles']);
  }
}
