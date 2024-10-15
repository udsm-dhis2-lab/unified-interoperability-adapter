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
  options: { name: string; code: string }[] = [];
  isSubmitting = false;

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
    const customFilters = [
      ...this.filterKey,
      { key: 'group', value: ['MAPPINGS-SETTINGS'] },
    ];
    this.loadConfigurationsFromServer(
      this.pageIndex,
      this.pageSize,
      customFilters
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
    const customFilters = [
      ...filter,
      { key: 'group', value: ['MAPPINGS-SETTINGS'] },
    ];
    this.loadConfigurationsFromServer(pageIndex, pageSize, customFilters);
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
      this.options.push({ name: optionName, code: optionCode });
      const formattedOptions = this.options
        .map((option) => `{name: ${option.name}, code: ${option.code}}`)
        .join(', ');
      this.settingsForm.get('options')!.setValue(formattedOptions);
      this.optionForm.reset();
    } else {
      console.log('Option form is invalid');
    }
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.isSubmitting = true;
      const json = {
        group: 'MAPPINGS-SETTINGS',
        key: this.settingsForm.get('configurationCode')!.value,
        value: {
          key: this.settingsForm.get('configurationCode')!.value,
          code: this.settingsForm.get('configurationCode')!.value,
          name: this.settingsForm.get('configurationName')!.value,
          options: [...this.options],
        },
      };

      this.dataSetManagementService
        .addConfiguration(Configuration.fromJson(json))
        .subscribe({
          next: (repsonse: any) => {
            this.isSubmitting = false;
            console.log('RESPONSE SUBMITTING SETTINGS: ', repsonse);
          },
          error: (err) => {
            this.isSubmitting = false;
            // TODO: Implement error handling
          },
        });
    } else {
      console.log('Configuration form is invalid');
    }
  }
}
