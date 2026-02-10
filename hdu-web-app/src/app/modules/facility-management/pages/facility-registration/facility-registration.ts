import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-facility-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './facility-registration.html',
  styleUrls: ['./facility-registration.scss'],
})
export class FacilityRegistration {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly router: Router = inject(Router);
  private readonly message: NzMessageService = inject(NzMessageService);
  loading = false;
  syncLoading = false;

  form = this.fb.group({
    hfrSearch: [''],
    facilityCode: ['', [Validators.required]],
    facilityName: ['', [Validators.required]],
    additionalParameters: [''],
    allowAccess: [true],
    category: [''],
    authType: [''],
    baseUrl: [''],
    path: [''],
  });

  constructor() {}

  syncFacility(): void {
    const searchValue = this.form.get('hfrSearch')?.value;
    if (!searchValue) {
      this.message.warning('Please enter facility name or code to sync');
      return;
    }

    this.syncLoading = true;
    setTimeout(() => {
      this.message.success('Facility synced from HFR Registry');
      this.form.patchValue({
        facilityCode: '115842-9',
        facilityName: 'DODOMA REGIONAL REFERRAL HOSPITAL',
      });
      this.syncLoading = false;
    }, 1500);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.message.success('Facility registered successfully');
      this.loading = false;
      this.router.navigate(['/facility-management']);
    }, 1000);
  }

  cancel(): void {
    this.form.reset();
    this.router.navigate(['/facility-management']);
  }
}
