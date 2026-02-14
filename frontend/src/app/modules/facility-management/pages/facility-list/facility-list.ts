// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { NzMessageService } from 'ng-zorro-antd/message';
// import { ZORRO_MODULES } from '@hdu/shared';

// interface Facility {
//   id: string;
//   code: string;
//   name: string;
//   status: 'allowed' | 'blocked';
//   referralConfigured: boolean;
//   accessControl: boolean;
// }

// const mockFacilities: Facility[] = [
//   {
//     id: '1',
//     code: '111841-3',
//     name: 'BENJAMIN MKAPA HOSPITAL',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '2',
//     code: '114394-0',
//     name: "WANGING'OMBE",
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '3',
//     code: '108289-0',
//     name: 'VWAWA',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '4',
//     code: '114003-7',
//     name: 'UYUI',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '5',
//     code: '114480-7',
//     name: 'UVINZA',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '6',
//     code: '108211-4',
//     name: 'UTETE',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '7',
//     code: '114024-3',
//     name: 'USHETU',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '8',
//     code: '108166-0',
//     name: 'USANGI',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '9',
//     code: '108148-8',
//     name: 'URAMBO',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '10',
//     code: '114553-1',
//     name: 'UBUNGO',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '11',
//     code: '107946-6',
//     name: 'TUNDURU',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '12',
//     code: '113990-6',
//     name: 'TUNDUMA',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
//   {
//     id: '13',
//     code: '109266-7',
//     name: 'TUMAINI',
//     status: 'allowed',
//     referralConfigured: true,
//     accessControl: true,
//   },
// ];

// @Component({
//   selector: 'app-facility-list',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
//   templateUrl: './facility-list.html',
//   styleUrls: ['./facility-list.scss'],
// })
// export class FacilityList {
//   facilities = [...mockFacilities];
//   searchText = '';
//   deleteModalVisible = false;
//   selectedFacility: Facility | null = null;

//   constructor(
//     private readonly router: Router,
//     private readonly message: NzMessageService,
//   ) {}

//   get filteredFacilities(): Facility[] {
//     const search = this.searchText.toLowerCase();
//     return this.facilities.filter(
//       (facility) =>
//         facility.name.toLowerCase().includes(search) ||
//         facility.code.toLowerCase().includes(search),
//     );
//   }

//   viewFacility(facility: Facility): void {
//     this.router.navigate(['/facility-management', facility.id, 'profile']);
//   }

//   configureReferral(facility: Facility): void {
//     this.router.navigate(['/facility-management', facility.id, 'referral-configuration']);
//   }

//   handleAccessControlChange(facility: Facility, checked: boolean): void {
//     this.facilities = this.facilities.map((item) =>
//       item.id === facility.id ? { ...item, accessControl: checked } : item,
//     );
//     this.message.success(`Access control ${checked ? 'enabled' : 'disabled'} for facility`);
//   }

//   openDeleteModal(facility: Facility): void {
//     this.selectedFacility = facility;
//     this.deleteModalVisible = true;
//   }

//   closeDeleteModal(): void {
//     this.deleteModalVisible = false;
//   }

//   confirmDelete(): void {
//     if (!this.selectedFacility) {
//       return;
//     }
//     const removed = this.selectedFacility;
//     this.facilities = this.facilities.filter((facility) => facility.id !== removed.id);
//     this.message.success(`Facility ${removed.name} deleted successfully`);
//     this.deleteModalVisible = false;
//     this.selectedFacility = null;
//   }
// }


import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
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
import { System } from '../../models/facility.models';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';

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
  templateUrl: './facility-list.html',
  styleUrl: './facility-list.scss',
})
export class FacilityList implements OnInit {
  facilities = signal<System[]>([]);
  loading = signal(false);
  searchTerm = '';

  pageIndex = 1;
  pageSize = 10;
  total = 0;

  private filterSubject = new Subject<void>();

  constructor(
    private facilityService: FacilityManagementService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadFacilities();

    this.filterSubject
      .pipe(
        debounceTime(1000),
        tap(() => this.loadFacilities()
        )
      ).subscribe();
  }

  ngOnDestroy(): void {
    if (this.filterSubject) {
      this.filterSubject.unsubscribe();
    }
  }

  loadFacilities(): void {
    this.loading.set(true);
    this.facilityService.getFacilities(this.pageIndex, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.facilities.set(response.facilities);
        this.total = response.pager.total;
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading facilities:', error);
        this.message.error('Failed to load facilities');
        this.loading.set(false);
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
    this.filterSubject.next();
  }

  onSwitchToggle(newValue: boolean, facility: System): void {
    const previousValue = facility.allowed;
    const action = newValue ? 'allow' : 'block';

    this.modal.confirm({
      nzTitle: `${action === 'allow' ? 'Allow' : 'Block'} Facility Access`,
      nzContent: `Are you sure you want to ${action} access for ${facility.name}?`,
      nzOnOk: () => {
        this.facilities.update(facilities =>
          facilities.map(f =>
            f.id === facility.id ? { ...f, allowed: newValue } : f
          )
        );

        return this.facilityService.updateFacilityAccess(facility.id!, newValue).subscribe({
          next: () => {
            this.message.success(`Facility access ${action}ed successfully`);
          },
          error: (error) => {
            console.error('Error updating facility access:', error);
            this.message.error('Failed to update facility access');
            this.facilities.update(facilities =>
              facilities.map(f =>
                f.id === facility.id ? { ...f, allowed: previousValue } : f
              )
            );
          },
        });
      },
      nzOnCancel: () => {
        this.facilities.update(facilities =>
          facilities.map(f =>
            f.id === facility.id ? { ...f, allowed: previousValue } : f
          )
        );
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

  registerFacility(): void {
    this.router.navigate(['/facility-management/register']);
  }
}

