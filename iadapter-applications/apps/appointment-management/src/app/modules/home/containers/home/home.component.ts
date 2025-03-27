import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from '../../../../../../../../libs/search-bar/src/lib/search-bar/search-bar.component';
import { ClientManagementService } from '../../services/client-management.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    SearchBarComponent,
    NzInputModule,
    FormsModule,
    NzDatePickerModule,
    NzIconModule,
    NzSelectModule,
    NzTagModule,
  ],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy, OnInit {
  // Filter properties
  startDate: any = null;
  endDate: any = null;
  facilityFrom: string = '';
  facilityTo: string = '';
  clientId: string = '';
  firstName: string = '';

  allAppointments: any[] = []; // Stores all data from API
  displayedAppointments: any[] = []; // Stores current page data
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;

  // Search/filter properties
  selectedGender?: string;
  surname: string = '';
  gender: string = '';
  appointmentID: string = '';

  filters: any = {
    clientId: '',
    firstName: '',
    surname: '',
    gender: '',
    appointmentID: '',
    startDate: '',
    endDate: '',
    referringFacility: '',
  };

  constructor(
    private router: Router,
    private clientManagementService: ClientManagementService
  ) {}

  ngOnDestroy(): void {
    if (this.loadHduClientsSubscription) {
      this.loadHduClientsSubscription.unsubscribe();
    }
  }

  loadHduClientsSubscription!: Subscription;

  loadHduClientsFromServer(): void {
    this.loading = true;
    this.loadHduClientsSubscription = this.clientManagementService
      .getAppointments({
        ...(this.filters ?? {}),
        code: 'FHIR-APPOINTMENT-QUERY',
      })
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.allAppointments = JSON.parse(data.data);
          this.total = data.data.length;
          this.total = this.allAppointments.length;
          this.updateDisplayedAppointments();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error Loading Appointments:', error);
        },
      });
  }

  // Handle pagination changes
  updateDisplayedAppointments(): void {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (this.allAppointments.length > 0) {
      this.displayedAppointments = this.allAppointments.slice(
        startIndex,
        endIndex
      );
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex } = params;
    console.log('Query params changed:', params);
    this.pageSize = pageSize;
    this.pageIndex = pageIndex;
    this.updateDisplayedAppointments();
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer();
  }

  viewClientDetails(client: any) {
    this.router.navigate(['/appointment-management/appointment-details'], {
      queryParams: {
        client: JSON.stringify(client),
        parentRoute: '/appointment-management/appointments-list',
      },
    });
  }

  applyFilters() {
    // Reset to first page when filters change
    this.pageIndex = 1;
    this.loadHduClientsFromServer();
  }

  resetFilters() {
    this.selectedGender = '';
    this.clientId = '';
    this.firstName = '';
    this.surname = '';
    this.appointmentID = '';
    this.startDate = null;
    this.endDate = null;

    // Reset filters object
    this.filters = {
      clientId: '',
      firstName: '',
      surname: '',
      gender: '',
      appointmentID: '',
      startDate: '',
      endDate: '',
      referringFacility: '',
    };

    this.pageIndex = 1;
    this.applyFilters();
  }

  filterData(event: any, type?: string): void {
    switch (type) {
      case 'gender':
        this.selectedGender = event;
        break;
      case 'firstName':
        this.firstName = event;
        break;
      case 'surname':
        this.surname = event;
        break;
      case 'appointmentID':
        this.appointmentID = event;
        break;
      case 'clientId':
        this.clientId = event;
        break;
      case 'startDate':
        this.startDate = event;
        break;
      case 'endDate':
        this.endDate = event;
        break;
      case 'referringFacility':
        this.facilityFrom = event;
        break;
      default:
        break;
    }

    this.filters = {
      ...this.filters,
      code: 'FHIR-APPOINTMENT-QUERY',
      gender: this.selectedGender,
      firstName: this.firstName,
      surname: this.surname,
      clientId: this.clientId,
      appointmentID: this.appointmentID,
      startDate: this.formatDateToYYYYMMDD(this.startDate || ''),
      endDate: this.formatDateToYYYYMMDD(this.endDate || ''),
      referringFacility: this.facilityFrom,
    };
  }

  formatDateToYYYYMMDD(dateString: string): string | null {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  }

  getStatusColor(status: any) {
    switch (status) {
      case 'booked':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }
}
