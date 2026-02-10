import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { AuthService } from '@hdu/core';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  private readonly message = inject(NzMessageService);

  loading = false;

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [false],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.error('Please fill in all required fields');
      return;
    }

    this.loading = true;
    const { username, password } = this.form.getRawValue();

    this.auth.login(username ?? '', password ?? '').subscribe({
      next: (response) => {
        this.loading = false;
        this.message.success('Login successful!');
        this.router.navigateByUrl('/clients');
      },
      error: (error) => {
        this.loading = false;
        const errorMessage = error?.error?.message || error?.message || 'Login failed. Please check your credentials.';
        this.message.error(errorMessage);
        console.error('Login error:', error);
      }
    });
  }
}
