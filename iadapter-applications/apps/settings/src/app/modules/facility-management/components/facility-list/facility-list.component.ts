import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FacilityManagementService } from '../../services/facility-management.service';
import { System } from '../../models/facility.model';

@Component({
    selector: 'app-facility-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NzTableModule,
        NzButtonModule,
        NzInputModule,
        NzTagModule,
        NzModalModule,
        NzSwitchModule,
        NzSpinModule,
        NzIconModule,
        NzCardModule,
        NzGridModule,
        NzTooltipModule,
        NzDropDownModule
    ],
    templateUrl: './facility-list.component.html',
    styleUrl: './facility-list.component.less',
})
export class FacilityListComponent implements OnInit {
    facilities: System[] = [];
    loading = false;
    searchTerm = '';

    // Pagination
    pageIndex = 1;
    pageSize = 50;
    total = 0;

    constructor(
        private facilityService: FacilityManagementService,
        private modal: NzModalService,
        private message: NzMessageService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.loadFacilities();
    }

    loadFacilities(): void {
        this.loading = true;
        this.facilityService.getFacilities(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
            next: (response) => {
                this.facilities = response.facilities;
                this.total = response.pager.total;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading facilities:', error);
                this.message.error('Failed to load facilities');
                this.loading = false;
            },
        });
    }

    onPageIndexChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.loadFacilities();
    }

    onPageSizeChange(pageSize: number): void {
        this.pageSize = pageSize;
        this.pageIndex = 1;
        this.loadFacilities();
    }

    onSearch(): void {
        this.pageIndex = 1;
        this.loadFacilities();
    }

    onSwitchToggle(newValue: boolean, facility: System): void {
        // facility.allowed still has the OLD value because we're using one-way binding
        const previousValue = facility.allowed;
        const action = newValue ? 'allow' : 'block';

        // Temporarily update the value so the switch shows the new state
        facility.allowed = newValue;

        this.modal.confirm({
            nzTitle: `${action === 'allow' ? 'Allow' : 'Block'} Facility Access`,
            nzContent: `Are you sure you want to ${action} access for ${facility.name}?`,
            nzOnOk: () => {
                return this.facilityService.updateFacilityAccess(facility.id!, newValue).subscribe({
                    next: () => {
                        this.message.success(`Facility access ${action}ed successfully`);
                        // Keep the new value
                    },
                    error: (error) => {
                        console.error('Error updating facility access:', error);
                        this.message.error('Failed to update facility access');
                        // Revert to previous value
                        facility.allowed = previousValue;
                    },
                });
            },
            nzOnCancel: () => {
                // Revert to previous value
                facility.allowed = previousValue;
            }
        });
    }

    viewDetails(facility: System): void {
        this.router.navigate([facility.id], { relativeTo: this.route });
    }

    configureMediator(facility: System): void {
        this.router.navigate([facility.id, 'mediator'], { relativeTo: this.route });
    }

    deleteFacility(facility: System): void {
        this.modal.confirm({
            nzTitle: 'Delete Facility',
            nzContent: `Are you sure you want to delete ${facility.name}? This action cannot be undone.`,
            nzOkText: 'Delete',
            nzOkDanger: true,
            nzOnOk: () => {
                return this.facilityService.deleteFacility(facility.id!).subscribe({
                    next: () => {
                        this.message.success('Facility deleted successfully');
                        this.loadFacilities();
                    },
                    error: (error) => {
                        console.error('Error deleting facility:', error);
                        this.message.error('Failed to delete facility');
                    },
                });
            },
        });
    }

}
