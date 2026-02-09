import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { AuthService } from '@hdu/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  readonly form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email } = this.form.getRawValue();
    setTimeout(() => {
      this.auth.login(email ?? '');
      this.loading = false;
      this.router.navigateByUrl('/clients');
    }, 1000);
  }
}
