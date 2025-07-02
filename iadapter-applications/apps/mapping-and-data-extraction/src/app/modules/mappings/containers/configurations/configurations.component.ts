import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
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
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css',
})
export class ConfigurationsComponent implements OnDestroy, OnInit {
  configurationTypes: { key: string; name: string }[] = [
    { key: 'ageGroup', name: 'Age group' },
    { key: 'motherAgeGroup', name: 'Mother age group' },
    { key: 'gender', name: 'Gender' },
    { key: 'ageType', name: 'Age type' },
    { key: 'weightGroup', name: 'Weight Group' },
    { key: 'hivStatus', name: 'Hiv Status' },
    { key: 'serviceLocation', name: 'Service Location' },
  ];

  selectedConfigurationType: string = '';

  onConfigurationTypeSelect(configurationType: string) {
    this.selectedConfigurationType = configurationType;
    configurationType === 'ageGroup'
      ? (this.optionPlaceHolder =
        'Include startAge, endAge, code and name keys in your options')
      : configurationType === 'weightGroup'
        ? (this.optionPlaceHolder =
          'Include lowerWeight, higherWeight, code and name keys in your options') :
        configurationType === 'motherAgeGroup'
          ? (this.optionPlaceHolder =
            'Include motherStartAge, motherEndAge, code and name keys in your options')
          :
          this.optionPlaceHolder = 'Include code and name in your options';
  }

  defaultPlaceHolder: string = 'Include code and name in your options';
  optionPlaceHolder: string = this.defaultPlaceHolder;

  alert = {
    show: false,
    type: '',
    message: '',
  };

  isDeleting = false;

  settingsForm!: FormGroup;
  optionElementForm!: FormGroup;
  optionForm!: FormGroup;
  // options: {}[] = [];
  optionElements: { [key: string]: string }[] = [];
  isSubmitting = false;

  total = 1;
  listOfConfigurations: Configuration[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{ key: '', value: [] }];

  isDrwawerVisible = false;

  isFirstLoad = true;
  isEditing: boolean = false;
  configuration?: Configuration;

  constructor(
    private dataSetManagementService: DatasetManagementService,
    private fb: NonNullableFormBuilder,
    private modal: NzModalService
  ) {
    this.settingsForm = this.fb.group({
      configurationName: ['', Validators.required],
      configurationCode: ['', Validators.required],
      options: ['', Validators.required],
    });

    // this.optionElementForm = this.fb.group({
    //   key: ['', Validators.required],
    //   value: ['', Validators.required],
    // });

    // this.optionForm = this.fb.group({
    //   option: ['', Validators.required],
    // });
  }

  ngOnInit(): void {
    this.reLoadConfigurations();
  }

  reLoadConfigurations() {
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
    this.clearForm();
    this.isDrwawerVisible = false;
  }

  // onAddOptionElement(): void {
  //   if (this.optionElementForm.valid) {
  //     const optionElementKey = this.optionElementForm.get('key')!.value;
  //     const optionElementValue = this.optionElementForm.get('value')!.value;
  //     this.optionElements = {
  //       ...this.optionElements,
  //       [optionElementKey]: optionElementValue,
  //     };
  //     const formattedOption = this.optionElements;

  //     const optionString = JSON.stringify(formattedOption, null, 2);
  //     this.optionForm.get('option')!.setValue(optionString);
  //     this.optionElementForm.reset();
  //   } else {
  //     // TODO: Show error
  //   }
  // }

  // onAddOption(): void {
  //   if (this.optionForm.valid) {
  //     this.options.push(this.optionElements);
  //     this.optionForm.reset();
  //     this.optionElements = [];
  //     const formattedOptions = JSON.stringify(this.options, null, 2);
  //     this.settingsForm.get('options')!.setValue(formattedOptions);
  //   } else {
  //     // TODO: Show error
  //   }
  // }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.isSubmitting = true;
      const option = JSON.parse(this.settingsForm.get('options')!.value);
      const payLoad: any = {
        group: 'MAPPINGS-SETTINGS',
        key: this.settingsForm.get('configurationCode')!.value,
        value: {
          key: this.settingsForm.get('configurationCode')!.value,
          code: this.settingsForm.get('configurationCode')!.value,
          name: this.settingsForm.get('configurationName')!.value,
          keyToUseInMappings: this.selectedConfigurationType,
          options: option,
        },
      };

      if (this.isEditing) {
        payLoad.uuid = this.configuration!.uuid;
        this.updateConfiguration(payLoad);
        return;
      }

      this.dataSetManagementService.addConfiguration(payLoad).subscribe({
        next: (repsonse: any) => {
          this.isSubmitting = false;
          this.clearForm();
          this.reLoadConfigurations();
          this.onCloseSideDrawer();
          this.alert = {
            show: true,
            type: 'success',
            message: 'Configuration was added successfully',
          };
        },
        error: (error) => {
          this.isSubmitting = false;
          this.alert = {
            show: true,
            type: 'error',
            message: error.message,
          };
          // TODO: Implement error handling
        },
      });
    } else {
      // TODO: Show error
    }
  }

  getKeys(obj: any): string[] {
    return Object?.keys(obj) || [];
  }

  showDeleteConfirm(uuid: string): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this configuration?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteConfiguration(uuid),
    });
  }

  editConfiguration(configuration: Configuration) {
    this.isEditing = true;
    this.configuration = configuration;
    this.onOpenSideDrawer();
    const formattedOptions = JSON.stringify(
      this.configuration.options,
      null,
      2
    );
    this.selectedConfigurationType = configuration.keyToUseInMappings;
    this.settingsForm.get('options')!.setValue(formattedOptions);
    this.settingsForm.get('configurationName')!.setValue(configuration.name);
    this.settingsForm.get('configurationCode')!.setValue(configuration.code);
  }

  updateConfiguration(configuration: any) {
    this.isSubmitting = true;
    this.dataSetManagementService.editConfiguration(configuration).subscribe({
      next: (repsonse: any) => {
        this.isSubmitting = false;
        this.isEditing = false;
        this.clearForm();
        this.reLoadConfigurations();
        this.onCloseSideDrawer();
        this.alert = {
          show: true,
          type: 'success',
          message: 'Configuration updated successfully',
        };
      },
      error: (error) => {
        this.isSubmitting = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
        // TODO: Implement error handling
      },
    });
  }

  deleteConfiguration(uuid: string) {
    this.isDeleting = true;
    this.alert = {
      show: true,
      type: 'info',
      message: 'Deleting configuration...',
    };
    this.dataSetManagementService.deleteConfiguration(uuid).subscribe({
      next: () => {
        this.isDeleting = false;
        this.onCloseAlert();
        this.alert = {
          show: true,
          type: 'success',
          message: 'Configuration deleted successfully',
        };
        this.reLoadConfigurations();
      },
      error: (error: any) => {
        this.isDeleting = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
      },
    });
  }

  clearForm() {
    this.settingsForm.reset();
    this.selectedConfigurationType = '';
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
