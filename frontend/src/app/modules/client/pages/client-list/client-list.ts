import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { ClientManagementService } from '../services/client-management.service';
import { debounceTime, Subject, Subscription, switchMap, throwError } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-client-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './client-list.html',
  styleUrls: ['./client-list.scss'],
})
export class ClientListPage {
  //TODO: Implement these when analytical data is available from the backend

  // get verifiedClients(): number {
  //   return mockClients.length - 2;
  // }

  total = signal(0);
  listOfHduPatients = signal<any[]>([]);
  loading = signal(false);
  pageSize = signal(10);
  pageIndex = signal(1);
  filterKey = [{}];

  startDate: any = null;
  endDate: any = null;
  gender: string = '';
  clientId: string = '';
  firstName: string = '';
  surname?: string;
  idNumber?: string;

  isFirstLoad = true;
  // dataSetSeachQuery: string = '';

  private filterSubject = new Subject<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnDestroy(): void {
    if (this.filterSubject) {
      this.filterSubject.unsubscribe();
    }
  }

  clientManagementService = inject(ClientManagementService);

  ngOnInit(): void {
    this.loadHduClientsFromServer(this.pageIndex(), this.pageSize(), []);

    this.filterSubject
      .pipe(
        debounceTime(300),
        switchMap(() => {
          const filters = this.buildFilters();
          return this.clientManagementService.getHduClients(
            this.pageIndex(),
            this.pageSize(),
            filters
          );
        })
      )
      .subscribe({
        next: (data: any) => {
          this.loading.set(false);
          this.total.set(data?.pager?.total || 0);
          this.pageIndex.set(data?.pager?.page || 1);
          this.listOfHduPatients.set(data?.results || []);
        },
        error: (error: any) => {
          throwError(() => error);
        },
      });
  }

  loadHduClientsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading.set(true);
    this.clientManagementService
      .getHduClients(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: any) => {
          this.loading.set(false);
          this.total.set(data?.pager?.total || 0);
          this.pageIndex.set(data?.pager?.page || 1);
          this.listOfHduPatients.set(data?.results || []);
          console.log('Fetched clients:', data?.results?.length);
        },
        error: (error) => {
          throwError(() => error);
        },
      });
  }

  // onDatasetsSearchInputTyping(value: string) {
  //   this.dataSetSeachQuery = value;
  //   if (value.length >= 3 || value === '') {
  //     this.loadHduClientsFromServer(1, 10, [
  //       value !== ''
  //         ? { key: 'firstName', value: [value] }
  //         : { key: '', value: [] },
  //     ]);
  //   }
  // }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;
    const queryFilter = [
      ...filter,
      // this.dataSetSeachQuery !== ''
      //   ? { key: 'firstName', value: [this.dataSetSeachQuery] }
      //   : { key: '', value: [] },
    ];
    this.loadHduClientsFromServer(pageIndex, pageSize, queryFilter);
  }


  addFilter(event: any, type?: string): void {
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

  applyFilters() {
    this.loading.set(true);
    this.filterSubject.next();
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

  goToClientDetail(clientId: string): void {
    this.router.navigate(['/clients/profile', clientId]);
  }

  genderColor(gender: string): string {
    if (gender === 'male') return 'blue';
    if (gender === 'female') return 'pink';
    return 'default';
  }
}
