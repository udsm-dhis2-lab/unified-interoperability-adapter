import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacilityManagementService } from '../../services/facility-management.service';
import { FacilityResponse } from '../../models/facility.models';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-facility-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ...ZORRO_MODULES],
  templateUrl: './facility-profile.html',
  styleUrls: ['./facility-profile.scss'],
})
export class FacilityDetailsComponent implements OnInit {
  loading = signal(false);
  facilityId!: string;
  facilityData?: FacilityResponse;

  constructor(
    private facilityService: FacilityManagementService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.facilityId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.facilityId) {
      this.message.error('Facility ID is required');
      this.router.navigate(['/facilities']);
      return;
    }

    this.loadFacility();
  }

  loadFacility(): void {
    this.loading.set(true);
    this.facilityService.getFacilityById(this.facilityId).subscribe({
      next: (response) => {
        this.facilityData = response;
        console.log('-------------- ', this.facilityData);
        this.loading.set(false);
      },
      error: (error) => {
        this.message.error('Failed to load facility details');
        console.error('Load facility error:', error);
        this.loading.set(false);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
    });
  }

  configureMediator(): void {
    this.router.navigate([this.facilityId, 'mediator'], { relativeTo: this.route.parent });
  }

  backToList(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }

  formatParams(params: string | null | undefined): string {
    if (!params) return 'None';
    try {
      return JSON.stringify(JSON.parse(params), null, 2);
    } catch {
      return params;
    }
  }
}
