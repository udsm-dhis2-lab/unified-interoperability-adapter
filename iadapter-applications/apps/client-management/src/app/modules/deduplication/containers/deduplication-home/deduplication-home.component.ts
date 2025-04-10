import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Deduplication } from '../../models/deduplication.model';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from '../../../../../../../../libs/search-bar/src/lib/search-bar/search-bar.component';
// import { SearchBarComponent } from '@iadapter/search-bar';
@Component({
  selector: 'app-deduplication-home',
  standalone: true,
  imports: [SharedModule, SearchBarComponent],
  providers: [DeduplicationManagementService],
  templateUrl: './deduplication-home.component.html',
  styleUrl: './deduplication-home.component.css',
})
export class DeduplicationHomeComponent implements OnDestroy, OnInit {
  total = 1;
  listOfDeduplications: Deduplication[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  isFirstLoad = true;

  loadHduClientsSubscription!: Subscription;
  dataSetSeachQuery = '';

  constructor(
    private router: Router,
    private dedupicationManagementService: DeduplicationManagementService
  ) {}
  ngOnDestroy(): void {
    if (this.loadHduClientsSubscription) {
      this.loadHduClientsSubscription.unsubscribe();
    }
  }

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadHduClientsSubscription = this.dedupicationManagementService
      .getDeduplicationClients(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: any) => {
          console.log(data, "data")
          this.loading = false;
          this.total = data.total;
          this.pageIndex = data.pageIndex;
          this.listOfDeduplications = data.data;
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
          : { key: 'firstName', value: [] },
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
        : { key: 'firstName', value: [] },
    ];
    this.loadHduClientsFromServer(pageIndex, pageSize, queryFilter);
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer(this.pageIndex, this.pageSize, []);
  }

  viewDeduplicationDetails(deduplicate: Deduplication) {
    this.router.navigate(['/deduplication/deduplication-details'], {
      queryParams: { deduplicate: JSON.stringify(deduplicate) },
    });
  }
}
