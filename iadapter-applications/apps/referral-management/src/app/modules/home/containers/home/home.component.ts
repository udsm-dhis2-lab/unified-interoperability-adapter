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
  imports: [SharedModule, RouterModule, SearchBarComponent, NzInputModule,FormsModule, NzDatePickerModule, NzIconModule],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy, OnInit {
  startDate: Date | null = null;
  endDate: Date | null = null;
  facilityFrom: string = '';
  facilityTo: string = '';
  clientId: string = '';
  firstName: string = '';



  value?: string;
  total = 1;
  listOfHduClients: HDUAPIClientDetails[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  isFirstLoad = true;
  dataSetSeachQuery: string = '';

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
      .getHduSharedRecords(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: any) => {
          console.log(data, "data - new just saved");
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
  }

  viewClientDetails(client: HDUAPIClientDetails) {
    this.router.navigate(['/client-management/client-details'], {
      queryParams: { client: JSON.stringify(client) },
    });
  }


  onFilterChange(): void {
    this.filterData();
  }

  applyFilters(){
    this.onDatasetsSearchInputTyping(this.firstName);
  }


  filterData(): void {
    const filters = {
      startDate: this.startDate,
      endDate: this.endDate,
      facilityFrom: this.facilityFrom,
      facilityTo: this.facilityTo,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      clientId: this.clientId,
    };

  }
}
