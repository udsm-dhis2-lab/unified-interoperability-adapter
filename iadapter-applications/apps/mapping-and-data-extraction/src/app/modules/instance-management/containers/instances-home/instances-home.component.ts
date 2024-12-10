import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InstanceManagementService } from 'apps/mapping-and-data-extraction/src/app/shared';
import { Instance } from 'apps/mapping-and-data-extraction/src/app/shared/models';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-instances-home',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './instances-home.component.html',
  styleUrl: './instances-home.component.css',
})
export class InstancesHomeComponent implements OnInit {
  isDeleting: boolean = false;
  isUpdating: boolean = false;

  alert = {
    show: false,
    type: '',
    message: '',
  };

  instanceForm!: FormGroup;
  isSubmitting: boolean = false;
  isDrawerVisible: boolean = false;

  total = 1;
  listOfInstances: Instance[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey: Array<{ key: string; value: string[] }> = [
    {
      key: '',
      value: [],
    },
  ];

  isFirstLoad: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private instanceManagementService: InstanceManagementService
  ) {
    this.instanceForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      code: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.reloadFetchingInstances();
  }

  reloadFetchingInstances(): void {
    this.loadInstanceManagementFromServer(
      this.pageIndex,
      this.pageSize,
      this.filterKey
    );
  }
  onOpenSideDrawer(event: Event): void {
    event.stopPropagation();
    this.isDrawerVisible = true;
  }

  onCloseSideDrawer(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.closeSideDrawer();
  }

  closeSideDrawer(): void {
    this.clearFrom();
    this.isDrawerVisible = false;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
    var payLoad = this.instanceForm.value;
    this.addOrUpdateInstance(payLoad);
  }

  addOrUpdateInstance(payLoad: any) {
    this.isSubmitting = true;
    this.instanceManagementService.verifyAndAddInstance(payLoad).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.alert = {
          show: true,
          type: 'success',
          message: 'Added instance successfully',
        };
        this.closeSideDrawer();
        this.reloadFetchingInstances();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
        this.closeSideDrawer();
        // TODO: Implement error handling
      },
    });
  }

  deleteInstance(uuid: string) {
    this.isDeleting = true;
    this.instanceManagementService.deleteInstance(uuid).subscribe({
      next: (response) => {
        this.isDeleting = false;
        this.alert = {
          show: true,
          type: 'success',
          message: 'Added instance successfully',
        };
        this.reloadFetchingInstances();
      },
      error: (error) => {
        this.isDeleting = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
        // TODO: Implement error handling
      },
    });
  }

  loadInstanceManagementFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ) {
    this.instanceManagementService
      .getInstances(pageIndex, pageSize, true, filter)
      .subscribe({
        next: (response) => {
          this.listOfInstances = response.listOfInstances;
          this.total = response.total;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          // TODO: Implement error handling
        },
      });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;

    this.loadInstanceManagementFromServer(pageIndex, pageSize, filter);
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }

  clearFrom() {
    this.instanceForm.reset();
  }
}
