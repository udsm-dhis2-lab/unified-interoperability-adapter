import { Component, OnDestroy } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { HduClient } from '../../models';
import { ClientManagementService } from '../../services/client-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, NzBreadCrumbModule, RouterModule],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnDestroy {
  total = 1;
  listOfHduClients: HduClient[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  isFirstLoad = true;

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
          this.loading = false;
          //TODO: Set total from data after it's support in fhir is implemented
          this.total = 4000; //data.total;
          this.pageIndex = data.pageIndex;
          this.listOfHduClients = data.listOfClients;
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

  viewClientDetails() {
    this.router.navigate(['/client-details']);
  }
}
