import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';
import { HduClient } from '../../models';
import { ClientManagement } from '../../services/client-management';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, HttpClientModule],
  providers: [ClientManagement],
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
    private hduClientService: ClientManagement
  ) {}

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.hduClientService
      .getHduClients(pageIndex, pageSize, filter)
      .subscribe((data: any) => {
        this.loading = false;
        this.total = 200; // mock the total data here
        this.listOfHduClients = data.results;
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
