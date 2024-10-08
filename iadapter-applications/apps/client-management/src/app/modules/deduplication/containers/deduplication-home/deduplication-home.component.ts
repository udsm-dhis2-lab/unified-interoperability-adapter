import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Deduplication } from '../../models/deduplication.model';
import { DeduplicationManagementService } from '../../services/deduplication-management.service';

@Component({
  selector: 'app-deduplication-home',
  standalone: true,
  imports: [SharedModule],
  providers: [DeduplicationManagementService],
  templateUrl: './deduplication-home.component.html',
  styleUrl: './deduplication-home.component.css',
})
export class DeduplicationHomeComponent {
  total = 1;
  listOfDeduplications: Deduplication[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  constructor(
    private router: Router,
    private dedupicationManagementService: DeduplicationManagementService
  ) {}

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.dedupicationManagementService
      .getDeduplicationClients(pageIndex, pageSize, filter)
      .subscribe((data: any) => {
        this.loading = false;
        this.total = 200; // mock the total data here
        this.listOfDeduplications = data.results;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex, filter } = params;

    this.loadHduClientsFromServer(pageIndex, pageSize, filter);
  }

  ngOnInit(): void {
    this.loadHduClientsFromServer(this.pageIndex, this.pageSize, []);
  }

  viewClientDetails() {
    this.router.navigate(['/client-details']);
  }
}
