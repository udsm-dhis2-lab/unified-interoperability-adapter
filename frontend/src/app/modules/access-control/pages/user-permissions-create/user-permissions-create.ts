import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-user-permissions-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './user-permissions-create.html',
  styleUrls: ['./user-permissions-create.scss'],
})
export class UserAuthorityCreate {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);

  form = this.fb.group({
    authorityName: ['', [Validators.required]],
    authorityCode: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/)]],
    description: ['', [Validators.required]],
    category: [null, [Validators.required]],
    riskLevel: ['medium', [Validators.required]],
    resourceType: [''],
    operationType: [[] as string[]],
    apiEndpoints: [''],
    status: [true],
    requiresTwoFactor: [false],
    auditActions: [true],
  });

  constructor() {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.router.navigate(['/access-control/user-authorities']);
  }

  cancel(): void {
    this.router.navigate(['/access-control/user-authorities']);
  }
}
