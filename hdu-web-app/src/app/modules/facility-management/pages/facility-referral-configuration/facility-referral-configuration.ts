import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';

const mockFacilityData: Record<
  string,
  {
    id: string;
    code: string;
    name: string;
    category: string;
    baseUrl: string;
    path: string;
    authType: string;
  }
> = {
  '1': {
    id: '1',
    code: '111841-3',
    name: 'BENJAMIN MKAPA HOSPITAL',
    category: 'REFERRAL',
    baseUrl: 'https://136.182.78.163:8888',
    path: '/MappingTestHIS/referralsWebhook',
    authType: 'BASIC',
  },
};

@Component({
  selector: 'app-facility-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ...ZORRO_MODULES],
  templateUrl: './facility-referral-configuration.html',
  styleUrls: ['./facility-referral-configuration.scss'],
})
export class FacilityReferralConfiguration {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly message: NzMessageService = inject(NzMessageService);
  facilityId: string | null = this.route.snapshot.paramMap.get('facilityId');
  facility = this.facilityId ? mockFacilityData[this.facilityId] : null;
  loading = false;

  form = this.fb.group({
    category: ['', [Validators.required]],
    authType: ['', [Validators.required]],
    baseUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\//i)]],
    path: ['', [Validators.required]],
  });

  constructor() {
    if (this.facility) {
      this.form.patchValue({
        category: this.facility.category,
        authType: this.facility.authType,
        baseUrl: this.facility.baseUrl,
        path: this.facility.path,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.message.success('Referral configuration updated successfully');
      this.loading = false;
      if (this.facilityId) {
        this.router.navigate(['/facility-management', this.facilityId, 'profile']);
      } else {
        this.router.navigate(['/facility-management']);
      }
    }, 1000);
  }

  cancel(): void {
    if (this.facilityId) {
      this.router.navigate(['/facility-management', this.facilityId, 'profile']);
    } else {
      this.router.navigate(['/facility-management']);
    }
  }
}
