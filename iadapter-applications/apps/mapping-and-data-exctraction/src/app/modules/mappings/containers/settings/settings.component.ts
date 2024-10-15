import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { Configuration, ConfigurationPage } from '../../models';
import { Subscription } from 'rxjs';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnDestroy, OnInit {
  settingsForm!: FormGroup;
  optionForm!: FormGroup;
  options: string[] = [];

  total = 1;
  listOfConfigurations: Configuration[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{ key: '', value: [] }];

  isDrwawerVisible = false;

  isFirstLoad = true;

  constructor(
    private dataSetManagementService: DatasetManagementService,
    private fb: NonNullableFormBuilder
  ) {
    this.settingsForm = this.fb.group({
      configurationName: ['', Validators.required],
      configurationCode: ['', Validators.required],
      options: ['', Validators.required],
    });

    this.optionForm = this.fb.group({
      optionName: ['', Validators.required],
      optionCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadConfigurationsFromServer(
      this.pageIndex,
      this.pageSize,
      this.filterKey
    );
  }

  loadConfigurationSubscription!: Subscription;

  ngOnDestroy(): void {
    if (this.loadConfigurationSubscription) {
      this.loadConfigurationSubscription.unsubscribe();
    }
  }

  loadConfigurationsFromServer(
    pageIndex: number,
    pageSize: number,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadConfigurationSubscription = this.dataSetManagementService
      .getConfigurations(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: ConfigurationPage) => {
          this.loading = false;
          //TODO: Set total from data after it's support in fhir is implemented
          this.total = data.total; //data.total;
          this.pageIndex = data.pageIndex;
          this.listOfConfigurations = data.listOfConfigurations;
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

    this.loadConfigurationsFromServer(pageIndex, pageSize, filter);
  }

  onOpenSideDrawer(): void {
    this.isDrwawerVisible = true;
  }

  onCloseSideDrawer(): void {
    this.isDrwawerVisible = false;
  }

  onAddOption(): void {
    if (this.optionForm.valid) {
      const optionName = this.optionForm.get('optionName')!.value;
      const optionCode = this.optionForm.get('optionCode')!.value;
      this.options.push(`${optionName} (${optionCode})`);
      this.settingsForm.get('options')!.setValue(this.options.join(', '));
      this.optionForm.reset();
    } else {
      console.log('Option form is invalid');
    }
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      console.log(this.settingsForm.value);
    } else {
      console.log('Configuration form is invalid');
    }
  }
}
