import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { ServicesTerminologyServiceService } from '../../services/services-terminology-service.service';

import { NzMessageService } from 'ng-zorro-antd/message';
import { GeneralCodesComponent } from '../general-codes/general-codes.component';
import { StandardCodesComponent } from '../standard-codes/standard-codes.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    GeneralCodesComponent,
    StandardCodesComponent
  ],
})
export class HomeComponent implements OnInit {
  drawerVisible = false;
  codes: any[] = [];
  loading = false;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 0;
  selectedNamespace: string | null = "ICD-CODES";

  alert = {
    show: false,
    type: 'success' as 'success' | 'info' | 'error' | 'warning',
    message: '',
  };

  constructor(
    private serviceTerminologyService: ServicesTerminologyServiceService,
  ) { }

  ngOnInit(): void {
    this.loadCodes();
  }

  loadCodes(resetPage: boolean = false): void {
    if (resetPage) {
      this.pageIndex = 1;
    }
    this.loading = true;
    const namespaceToFetch = this.selectedNamespace === null ? undefined : this.selectedNamespace;
    this.serviceTerminologyService.getServiceCodes(namespaceToFetch || '', this.pageIndex, this.pageSize).subscribe({
      next: (response: any) => {
        this.codes = response.results;
        this.totalRecords = response.pager.total;
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        this.showAlert('error', `Error fetching codes: ${error.message || 'Unknown error'}`);
      }
    });
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadCodes();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.loadCodes(true);
  }

  openDrawer(): void {
    this.drawerVisible = true;
  }

  closeDrawer(): void {
    this.drawerVisible = false;
  }

  handleCodeAdded(): void {
    this.showAlert('success', 'Code added successfully. Refreshing list.');
    this.loadCodes(true); 
    this.closeDrawer();
  }

  showAlert(type: 'success' | 'info' | 'error' | 'warning', message: string): void {
    this.alert = { show: true, type, message };
    setTimeout(() => this.onCloseAlert(), 5000);
  }

  onCloseAlert(): void {
    this.alert.show = false;
  }
}
