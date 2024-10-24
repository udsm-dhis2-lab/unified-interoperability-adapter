import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Deduplication } from '../../models/deduplication.model';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';
import { Subscription } from 'rxjs';
import { SearchBarComponent } from 'search-bar';

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
          this.loading = false;
          //TODO: Set total from data after it's support in fhir is implemented
          this.total = 200; //data.total;
          this.pageIndex = data.pageIndex;
          this.listOfDeduplications = data.data;
        },
        error: (error) => {
          this.loading = false;
          //TODO: Implement error handling
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;
    this.loadHduClientsFromServer(pageIndex, pageSize, filter);
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer(this.pageIndex, this.pageSize, []);
  }

  viewDeduplicationDetails() {
    this.router.navigate(['/deduplication/deduplication-details']);
  }
}
