import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ZORRO_MODULES } from '@hdu/shared';

interface Facility {
  id: string;
  code: string;
  name: string;
  status: 'allowed' | 'blocked';
  referralConfigured: boolean;
  accessControl: boolean;
}

const mockFacilities: Facility[] = [
  {
    id: '1',
    code: '111841-3',
    name: 'BENJAMIN MKAPA HOSPITAL',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '2',
    code: '114394-0',
    name: "WANGING'OMBE",
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '3',
    code: '108289-0',
    name: 'VWAWA',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '4',
    code: '114003-7',
    name: 'UYUI',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '5',
    code: '114480-7',
    name: 'UVINZA',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '6',
    code: '108211-4',
    name: 'UTETE',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '7',
    code: '114024-3',
    name: 'USHETU',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '8',
    code: '108166-0',
    name: 'USANGI',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '9',
    code: '108148-8',
    name: 'URAMBO',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '10',
    code: '114553-1',
    name: 'UBUNGO',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '11',
    code: '107946-6',
    name: 'TUNDURU',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '12',
    code: '113990-6',
    name: 'TUNDUMA',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
  {
    id: '13',
    code: '109266-7',
    name: 'TUMAINI',
    status: 'allowed',
    referralConfigured: true,
    accessControl: true,
  },
];

@Component({
  selector: 'app-facility-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './facility-list.html',
  styleUrls: ['./facility-list.scss'],
})
export class FacilityList {
  facilities = [...mockFacilities];
  searchText = '';
  deleteModalVisible = false;
  selectedFacility: Facility | null = null;

  constructor(
    private readonly router: Router,
    private readonly message: NzMessageService,
  ) {}

  get filteredFacilities(): Facility[] {
    const search = this.searchText.toLowerCase();
    return this.facilities.filter(
      (facility) =>
        facility.name.toLowerCase().includes(search) ||
        facility.code.toLowerCase().includes(search),
    );
  }

  registerFacility(): void {
    this.router.navigate(['/facility-management/register']);
  }

  viewFacility(facility: Facility): void {
    this.router.navigate(['/facility-management', facility.id, 'profile']);
  }

  configureReferral(facility: Facility): void {
    this.router.navigate(['/facility-management', facility.id, 'referral-configuration']);
  }

  handleAccessControlChange(facility: Facility, checked: boolean): void {
    this.facilities = this.facilities.map((item) =>
      item.id === facility.id ? { ...item, accessControl: checked } : item,
    );
    this.message.success(`Access control ${checked ? 'enabled' : 'disabled'} for facility`);
  }

  openDeleteModal(facility: Facility): void {
    this.selectedFacility = facility;
    this.deleteModalVisible = true;
  }

  closeDeleteModal(): void {
    this.deleteModalVisible = false;
  }

  confirmDelete(): void {
    if (!this.selectedFacility) {
      return;
    }
    const removed = this.selectedFacility;
    this.facilities = this.facilities.filter((facility) => facility.id !== removed.id);
    this.message.success(`Facility ${removed.name} deleted successfully`);
    this.deleteModalVisible = false;
    this.selectedFacility = null;
  }
}
