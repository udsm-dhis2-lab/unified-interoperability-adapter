import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';
import { AuthService } from '@hdu/core';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.scss'],
})
export class UserSettings {
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);
  private readonly auth = inject(AuthService);

  settings = {
    firstName: 'Amina',
    lastName: 'Mwakasege',
    email: this.auth.userInfo()?.email || 'amina.mwakasege@health.go.tz',
    phoneNumber: '+255 755 123 456',
    language: 'en',
    timezone: 'Africa/Dar_es_Salaam',
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    systemAlerts: true,
    twoFactorEnabled: false,
    sessionTimeout: '30',
    dateFormat: 'DD/MM/YYYY',
  };

  profileForm = this.fb.group({
    firstName: [this.settings.firstName, [Validators.required]],
    lastName: [this.settings.lastName, [Validators.required]],
    email: [
      { value: this.settings.email, disabled: true },
      [Validators.required, Validators.email],
    ],
    phoneNumber: [this.settings.phoneNumber, [Validators.required]],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.matchPasswords },
  );

  notificationsForm = this.fb.group({
    emailNotifications: [this.settings.emailNotifications],
    appointmentReminders: [this.settings.appointmentReminders],
    systemAlerts: [this.settings.systemAlerts],
    smsNotifications: [this.settings.smsNotifications],
  });

  securityForm = this.fb.group({
    twoFactorEnabled: [this.settings.twoFactorEnabled],
    sessionTimeout: [this.settings.sessionTimeout],
  });

  preferencesForm = this.fb.group({
    language: [this.settings.language],
    timezone: [this.settings.timezone],
    dateFormat: [this.settings.dateFormat],
  });

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.message.success('Profile changes saved');
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.message.success('Password updated successfully');
    this.passwordForm.reset();
  }

  saveNotifications(): void {
    this.message.success('Notification preferences saved');
  }

  saveSecurity(): void {
    this.message.success('Security settings saved');
  }

  savePreferences(): void {
    this.message.success('Preferences saved');
  }

  private matchPasswords(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value as string | null;
    const confirm = control.get('confirmPassword');

    if (!confirm) {
      return null;
    }

    if (confirm.value && newPassword !== confirm.value) {
      confirm.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (confirm.hasError('mismatch')) {
      const errors: any = { ...confirm.errors };
      delete errors.mismatch;
      if (Object.keys(errors).length === 0) {
        confirm.setErrors(null);
      } else {
        confirm.setErrors(errors);
      }
    }

    return null;
  }
}
