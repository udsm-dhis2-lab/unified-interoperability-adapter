import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FacilityManagementService } from '../../services/facility-management.service';
import { FacilityResponse } from '../../models/facility.model';

@Component({
    selector: 'app-facility-details',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NzCardModule,
        NzButtonModule,
        NzDescriptionsModule,
        NzTagModule,
        NzDividerModule,
        NzGridModule,
        NzSpinModule,
        NzTableModule,
        NzIconModule
    ],
    templateUrl: './facility-details.component.html',
    styleUrls: ['./facility-details.component.less']
})
export class FacilityDetailsComponent implements OnInit {
    loading = false;
    facilityId!: string;
    facilityData?: FacilityResponse;

    constructor(
        private facilityService: FacilityManagementService,
        private message: NzMessageService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

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
        this.loading = true;
        this.facilityService.getFacilityById(this.facilityId).subscribe({
            next: (response) => {
                this.facilityData = response;
                this.loading = false;
            },
            error: (error) => {
                this.message.error('Failed to load facility details');
                console.error('Load facility error:', error);
                this.loading = false;
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        });
    }

    configureMediator(): void {
        this.router.navigate([this.facilityId, 'mediator'], { relativeTo: this.route.parent });
    }

    goBack(): void {
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
