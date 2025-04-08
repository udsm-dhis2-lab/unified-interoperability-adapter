import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { HDUAPIClientDetails } from '../../models';
import { ClientManagementService } from '../../services/client-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { debounceTime, Subject, Subscription, switchMap } from 'rxjs';
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
    RouterModule,
    RouterModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
  ],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy, OnInit {
  total = 1;
  listOfHduClients: HDUAPIClientDetails[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  startDate: any = null;
  endDate: any = null;
  gender: string = '';
  clientId: string = '';
  firstName: string = '';
  referrals?: any = [];
  surname?: string;
  idNumber?: string;

  isFirstLoad = true;
  dataSetSeachQuery: string = '';

  private filterSubject = new Subject<void>();
  private filterSubscription!: Subscription;

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

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadHduClientsSubscription = this.clientManagementService
      .getHduClients(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.loading = false;
          this.total = data.total;
          this.pageIndex = data.pageIndex;
          this.listOfHduClients = data.listOfClients;
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
      this.loadHduClientsFromServer(1, 10, [
        value !== ''
          ? { key: 'firstName', value: [value] }
          : { key: '', value: [] },
      ]);
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
    this.loadHduClientsFromServer(pageIndex, pageSize, queryFilter);
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer(this.pageIndex, this.pageSize, []);

    // Set up the filter subscription
    this.filterSubscription = this.filterSubject
      .pipe(
        debounceTime(300), // Debounce to avoid rapid API calls
        switchMap(() => {
          const filters = this.buildFilters();
          return this.clientManagementService.getHduClients(
            this.pageIndex,
            this.pageSize,
            filters
          );
        })
      )
      .subscribe({
        next: (data: any) => {
          this.loading = false;
          this.total = data.total;
          this.pageIndex = data.pageIndex;
          this.listOfHduClients = data.listOfClients;
        },
        error: (error: any) => {
          this.loading = false;
          //TODO: Implement error handling
        },
      });
  }

  viewClientDetails(client: HDUAPIClientDetails) {
    console.log(client.demographicDetails);
    this.router.navigate(['/client-management/client-details'], {
      queryParams: {
        client: JSON.stringify(client.demographicDetails.clientID),
        parentRoute: '/client-management',
      },
    });
  }

  deleteClient(client: HDUAPIClientDetails) {

    this.loading = true;
    this.listOfHduClients = [];
    this.clientManagementService.deleteClient(client.demographicDetails.clientID).subscribe((response) => {
      this.filterSubject.next();
      console.log(response);

    });
  }

  resetFilters() {
    this.gender = '';
    this.clientId = '';
    this.firstName = '';
    this.surname = '';
    this.idNumber = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  filterData(event: any, type?: string): void {
    switch (type) {
      case 'gender':
        this.gender = event;
        break;
      case 'clientID':
        this.clientId = event;
        break;
      case 'firstName':
        this.firstName = event;
        break;
      case 'surname':
        this.surname = event;
        break;
      case 'idNumber':
        this.idNumber = event;
        break;

      case 'startDate':
        this.startDate = event;
        break;
      case 'endDate':
        this.endDate = event;
        break;

      default:
        break;
    }
  }

  applyFilters() {
    this.loading = true;
    this.filterSubject.next();
  }

  private buildFilters(): Array<{ key: string; value: string[] }> {
    const filters: Array<{ key: string; value: string[] }> = [];

    if (this.gender) {
      filters.push({ key: 'gender', value: [this.gender] });
    }
    if (this.clientId) {
      filters.push({ key: 'id', value: [this.clientId] });
    }
    if (this.firstName) {
      filters.push({ key: 'firstName', value: [this.firstName] });
    }
    if (this.surname) {
      filters.push({ key: 'lastName', value: [this.surname] });
    }
    if (this.idNumber) {
      filters.push({ key: 'id', value: [this.idNumber] });
    }
    if (this.startDate) {
      filters.push({ key: 'startDate', value: [this.startDate] });
    }
    if (this.endDate) {
      filters.push({ key: 'endDate', value: [this.endDate] });
    }

    return filters;
  }
}
