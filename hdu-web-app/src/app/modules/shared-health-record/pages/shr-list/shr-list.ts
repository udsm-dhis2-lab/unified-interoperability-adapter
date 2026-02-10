import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { mockClients } from 'src/app/core/data/mock-data';

@Component({
  selector: 'app-shr-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './shr-list.html',
  styleUrls: ['./shr-list.scss'],
})
export class ShrList {
  searchText = '';
  selectedFacility = '';
  filteredClients = [...mockClients];

  constructor(private readonly router: Router) {}

  uniqueFacilities = Array.from(
    new Set(mockClients.filter((c) => c.originFacility).map((c) => c.originFacility!.facilityId)),
  ).map((id) => mockClients.find((c) => c.originFacility?.facilityId === id)!.originFacility!);

  handleSearch(value: string): void {
    this.searchText = value;
    this.filterClients(value, this.selectedFacility);
  }

  handleFacilityFilter(value: string | null): void {
    this.selectedFacility = value ?? '';
    this.filterClients(this.searchText, this.selectedFacility);
  }

  filterClients(search: string, facility: string): void {
    let filtered = mockClients;

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (client) =>
          client.firstName.toLowerCase().includes(lower) ||
          client.lastName.toLowerCase().includes(lower) ||
          client.clientId.toLowerCase().includes(lower) ||
          client.nationalId.includes(search) ||
          client.phoneNumber.includes(search),
      );
    }

    if (facility) {
      filtered = filtered.filter((client) => client.originFacility?.facilityId === facility);
    }

    this.filteredClients = filtered;
  }

  reset(): void {
    this.searchText = '';
    this.selectedFacility = '';
    this.filteredClients = [...mockClients];
  }

  viewRecords(clientId: string): void {
    this.router.navigate(['/shared-health-records/profile', clientId]);
  }

  openIntegration(): void {
    this.router.navigate(['/shr/integration']);
  }

  genderColor(gender: string): string {
    if (gender === 'male') return 'blue';
    if (gender === 'female') return 'pink';
    return 'default';
  }
}
