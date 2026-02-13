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
  total = signal(0);
  listOfHduPatients = signal<any[]>([]);
  loading = signal(false);
  pageSize = signal(10);
  pageIndex = signal(1);
  filterKey = [{}];

  gender: string = '';
  clientId: string = '';
  firstName: string = '';
  surname?: string;
  idNumber?: string;

  isFirstLoad = true;
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
        debounceTime(1000),
        switchMap(() => {
          this.loading.set(true);
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
        },
        error: (error) => {
          throwError(() => error);
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;
    const queryFilter = [
      ...filter,
    ];
    this.loadHduClientsFromServer(pageIndex, pageSize, queryFilter);
  }


  addFilter(event: any, type?: string): void {
    if (type === 'gender') {
      this.gender = event;
    } else if (type === 'clientID') {
      this.clientId = event;
    } else if (type === 'firstName') {
      this.firstName = event;
    } else if (type === 'surname') {
      this.surname = event;
    } else if (type === 'idNumber') {
      this.idNumber = event;
    }
    this.applyFilters();
  }

  applyFilters() {
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
    return filters;
  }

  resetFilters() {
    this.gender = '';
    this.clientId = '';
    this.firstName = '';
    this.surname = '';
    this.idNumber = '';
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
