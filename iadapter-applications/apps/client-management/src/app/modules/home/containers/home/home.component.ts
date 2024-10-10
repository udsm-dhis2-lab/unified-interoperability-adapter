import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { HduClient } from '../../models';
import { ClientManagementService } from '../../services/client-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, NzBreadCrumbModule, RouterModule],
  providers: [ClientManagementService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  total = 1;
  listOfHduClients: HduClient[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  constructor(
    private router: Router,
    private clientManagementService: ClientManagementService
  ) {}

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.clientManagementService
      .getHduClients(pageIndex, pageSize, filter)
      .subscribe((data: any) => {
        this.loading = false;
        this.total = 200;
        this.pageIndex = pageIndex;
        this.listOfHduClients = data.results;
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
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
