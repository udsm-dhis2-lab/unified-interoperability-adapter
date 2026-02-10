import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { Client } from '@hdu/core';
import { mockClients } from 'src/app/core/data/mock-data';

@Component({
  selector: 'app-client-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.scss'],
})
export class ClientListPage {
  searchText = '';
  selectedGender = '';
  filteredClients: Client[] = [...mockClients];

  constructor(private readonly router: Router) {}

  get totalClients(): number {
    return mockClients.length;
  }

  get verifiedClients(): number {
    return mockClients.length - 2;
  }

  handleSearch(value: string): void {
    this.searchText = value;
    this.filterClients(value, this.selectedGender);
  }

  handleGenderFilter(value: string | null): void {
    this.selectedGender = value ?? '';
    this.filterClients(this.searchText, this.selectedGender);
  }

  filterClients(search: string, gender: string): void {
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

    if (gender) {
      filtered = filtered.filter((client) => client.gender === gender);
    }

    this.filteredClients = filtered;
  }

  reset(): void {
    this.searchText = '';
    this.selectedGender = '';
    this.filteredClients = [...mockClients];
  }

  goToClientDetail(clientId: string): void {
    this.router.navigate(['/clients/profile', clientId]);
  }

  genderColor(gender: string): string {
    if (gender === 'male') return 'blue';
    if (gender === 'female') return 'pink';
    return 'default';
  }
}
