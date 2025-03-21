import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { HDUAPIClientDetails } from '../../models';
import { ClientManagementService } from '../../services/client-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from '../../../../../../../../libs/search-bar/src/lib/search-bar/search-bar.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { FormsModule } from '@angular/forms';
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
  ],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy, OnInit {
  startDate: any = null;
  endDate: any = null;
  facilityFrom: string = '';
  facilityTo: string = '';
  clientId: string = '';
  firstName: string = '';
  referrals?: any = [];

  value?: string;
  total = 1;
  listOfHduClients: HDUAPIClientDetails[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  isFirstLoad = true;
  dataSetSeachQuery: string = '';

  selectedGender?: string;
  surname: string = '';
  gender: string = '';
  referralNumber: string = '';

  filters: any = {
    clientId: '',
    fistName: '',
    surname: '',
    gender: '',
    referralNumber: '',
    startDate: '',
    endDate: '',
    referringFacility: ''
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
      .getReferrals(this.filters)
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.total = 10;
          this.pageIndex = 1;
          this.referrals = data;
        },
        error: (error) => {
          this.loading = false;
          //TODO: Implement error handling
        },
      });
  }

  onDatasetsSearchInputTyping(value: string) {
    this.dataSetSeachQuery = value;
    if (value.length >= 3 || value === '') {
      this.loadHduClientsFromServer();
    }
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;
    const queryFilter = [
      ...filter,
      this.dataSetSeachQuery !== ''
        ? { key: 'firstName', value: [this.dataSetSeachQuery] }
        : { key: '', value: [] },
    ];
    this.loadHduClientsFromServer();
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer();

    this.clientManagementService
      .getReferrals(this.referrals)
      .subscribe((referrals) => {
        console.log(referrals);
      });
  }

  viewClientDetails(client: any) {
    this.router.navigate(['/shr-management/referral-details'], {
      queryParams: { client: JSON.stringify(client) , parentRoute: '/shr-management/referral-list'},
    });
  }

  onFilterChange(): void {

  }

  applyFilters() {

    this.loadHduClientsFromServer();
  }

  resetFilters() {
    this.selectedGender = '';
    this.clientId = '';
    this.firstName = '';
    this.surname = '';
    this.referralNumber = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  filterData(event: any, type?: string): void {

    switch (type){
      case "gender":
        this.selectedGender = event;
        break;

      case "firstName":
        this.firstName = event
        break;

      case "surname":
        this.surname = event
        break;

      case "referralNumber":
        this.referralNumber = event;
        break;

      case "clientId":
        this.clientId = event;
        break;

      case "startDate":
        this.startDate = event;
        break;
      case "endDate":
        this.endDate = event;
        break;
      case "referringFacility":
        this.facilityFrom = event;
        break;

      default:
        break;
    }

    this.filters = {
      ...this.filters,
      gender: this.selectedGender,
      firstName: this.firstName,
      clientId: this.clientId,
      referralNumber: this.referralNumber,
      startDate: this.formatDateToYYYYMMDD(this.startDate || ''),
      endDate: this.formatDateToYYYYMMDD(this.endDate || ''),
      referringFacility: this.facilityFrom
    };

    console.log(this.filters, "all filters")
  }

  clearFilter(){
    this.filters = {

    }
  }

  formatDateToYYYYMMDD(dateString: string): string | null {
    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return null; // Invalid date
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return null;
    }
  }

}
