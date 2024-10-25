import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectComponent } from 'apps/mapping-and-data-extraction/src/app/shared/components';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';
import { ConfigurationPage, IcdCodePage } from '../../models';

export interface MappingsData {
  disagregations: Disaggregation[];
}

interface Setting {
  name: string;
  selectedValue?: string;
  keyToUseInPayload?: string;
  options: any;
}

interface SelectedSettingOption {
  value: string;
  categoryOptionComboId: string;
  settingName: string;
}

class Disaggregation {
  categoryOptionComboId!: string;
  categoryOptionComboName!: string;
  configurations?: Setting[];

  constructor(categoryOptionComboId: string, categoryOptionComboName: string) {
    this.categoryOptionComboId = categoryOptionComboId;
    this.categoryOptionComboName = categoryOptionComboName;
  }
}

@Component({
  selector: 'app-dataset-mapping',
  standalone: true,
  imports: [SharedModule, SelectComponent],
  templateUrl: './dataset-mapping.component.html',
  styleUrl: './dataset-mapping.component.css',
})
export class DatasetMappingComponent implements OnInit {
  isSubmittingMapping: boolean = false;
  isDeletingMapping: boolean = false;
  mappingUuid?: string;

  alert = {
    show: false,
    type: '',
    message: '',
  };

  useIcdCodes = false;

  mappingsData: MappingsData = {
    disagregations: [],
  };

  selectedICdCodes: string[] = [];

  isLoadingDisaggregation: boolean = false;
  leftColumnSpan: number = 16;
  rightColumnSpan: number = 8;

  dataSetUuid: string = '';
  isLoading: boolean = true;
  datasetFormContent: string = '';
  sanitizedContent!: SafeHtml;

  inputElements: HTMLInputElement[] = [];
  selectedInputId: string = '';

  searchConfigurationChange$ = new BehaviorSubject('');
  placeHolderForConfigurationSelect: string = 'Select configuration';
  isLoadingConfigurations: boolean = false;
  selectedConfiguration?: string;
  configurationOptionList: any[] = [];

  onSearchConfiguration(value: string): void {
    this.isLoadingConfigurations = true;
    this.searchConfigurationChange$.next(value);
  }

  onConfigurationSelect(value: any) {
    this.assignConfigurationToSelectedDisaggregation(value);
  }

  assignConfigurationToSelectedDisaggregation(configuration: {
    name: string;
    options: any[];
  }): void {
    this.mappingsData.disagregations.forEach((item) => {
      item.configurations = [
        ...(item.configurations ?? []),
        {
          name: configuration.name,
          options: configuration.options,
        },
      ];
    });
  }

  searchIcdCodeChange$ = new BehaviorSubject('');
  placeHolderForIcdCodeSelect: string = 'Select ICD Code';
  isLoadingIcdCodes: boolean = false;
  selectedIcdCode?: string;
  icdCodeOptionList: any[] = [];

  onSearchIcdCode(value: string): void {
    this.isLoadingIcdCodes = true;
    this.searchIcdCodeChange$.next(value);
  }

  onIcdCodeSelect(value: string) {
    this.selectedICdCodes = [...this.selectedICdCodes, value];
  }

  onRemoveIcdCode(tag: string) {
    this.selectedICdCodes = this.selectedICdCodes.filter(
      (item) => item !== tag
    );
  }

  constructor(
    private route: ActivatedRoute,
    private dataSetManagementService: DatasetManagementService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataSetUuid = this.route.snapshot.params['uuid'];
    this.searchIcdCode();
    this.searchConfigurations();
    this.loadDatasetByIdFromServer(this.dataSetUuid);
  }

  loadDatasetByIdFromServer(uuid: string) {
    this.dataSetManagementService.getInstanceById(uuid).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
          data.datasetFields.dataEntryForm.htmlCode
        );
        this.cdr.detectChanges();
        this.addFocusListeners();
      },
      error: (error: any) => {
        this.isLoading = false;
        // TODO: Implement error handling
      },
    });
  }

  addFocusListeners(): void {
    this.inputElements = this.elRef.nativeElement.querySelectorAll(
      'input[name="entryfield"]'
    );
    this.inputElements.forEach((input: HTMLInputElement) => {
      this.renderer.listen(input, 'focus', (event) => this.onInputFocus(event));
    });
  }

  onInputFocus(event: FocusEvent): void {
    this.isLoadingDisaggregation = true;
    const inputElement = event.target as HTMLInputElement;
    this.selectedInputId = inputElement.id.split('-')[0];
    this.getCategoryOptionCombos(this.selectedInputId);
  }

  getCategoryOptionCombos(dataElementUuid: string) {
    this.dataSetManagementService
      .getCategoryOptionCombos(dataElementUuid)
      .subscribe({
        next: (data: any) => {
          const preSelectedInputs = this.elRef.nativeElement.querySelectorAll(
            'input[name="entryfield"][style*="background-color: green"]'
          );
          preSelectedInputs.forEach((input: HTMLInputElement) => {
            this.renderer.removeAttribute(input, 'disabled');
            this.renderer.removeStyle(input, 'background-color');
          });

          this.isLoadingDisaggregation = false;

          this.mappingsData.disagregations = data.map((item: any) => {
            const matchingInputs = this.elRef.nativeElement.querySelectorAll(
              `input[name="entryfield"][id*="${this.selectedInputId}-${item.id}"]`
            );
            matchingInputs.forEach((input: HTMLInputElement) => {
              this.renderer.setAttribute(input, 'disabled', 'true');
              this.renderer.setStyle(input, 'background-color', 'green');
            });
            return new Disaggregation(item.id, item.name);
          });
          if (this.mappingsData.disagregations.length > 0) {
            this.getExistingMappings(this.selectedInputId, this.dataSetUuid);
          }
        },
        error: (error: any) => {
          this.isLoadingDisaggregation = false;
          // TODO: Handle error
        },
      });
  }

  getExistingMappings(selectedInputId: string, datasetUuid: string) {
    this.dataSetManagementService
      .getExistingMappings(selectedInputId, datasetUuid)
      .subscribe({
        next: (data: any) => {
          this.mappingUuid = data.uuid;
          if (data.mapping.mappings.length > 0) {
            this.useIcdCodes = true;
            this.selectedICdCodes = data.mapping.mappings.map(
              (item: any) => item.code
            );
          }
          if (data.mapping.params.length > 0) {
            const param = data.mapping.params[0];
            if (param.gender) {
              const configuration = this.configurationOptionList.find(
                (item: any) => item.label === 'Gender'
              );
              this.assignConfigurationToSelectedDisaggregation(
                configuration.value
              );
            }
            if (param.ageType) {
              const configuration = this.configurationOptionList.find(
                (item: any) => item.label === 'Agetype'
              );
              this.assignConfigurationToSelectedDisaggregation(
                configuration.value
              );
            }
            if (param.startAge) {
              const configuration = this.configurationOptionList.find(
                (item: any) => item.label === 'Agegroup'
              );
              this.assignConfigurationToSelectedDisaggregation(
                configuration.value
              );
            }

            for (const param of data.mapping.params) {
              if (param.gender) {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.label === 'Gender'
                );
                this.onSelectMappingSetting({
                  value: param.gender,
                  categoryOptionComboId: param.co,
                  settingName: configuration.label,
                });
              }
              if (param.ageType) {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.label === 'Agetype'
                );
                this.onSelectMappingSetting({
                  value: param.ageType,
                  categoryOptionComboId: param.co,
                  settingName: configuration.label,
                });
              }
              if (param.startAge) {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.label === 'Agegroup'
                );
                this.onSelectMappingSetting({
                  value: param.startAge + '-' + param.endAge,
                  categoryOptionComboId: param.co,
                  settingName: configuration.label,
                });
              }
            }
          }
        },
        error: (error: any) => {
          this.mappingUuid = undefined;
        },
        //TODO: Implement error handling
      });
  }

  onCollapse() {
    if (this.leftColumnSpan === 16) {
      this.leftColumnSpan = 8;
      this.rightColumnSpan = 16;
    } else {
      this.leftColumnSpan = 16;
      this.rightColumnSpan = 8;
    }
  }

  searchIcdCode() {
    const icdList$: Observable<IcdCodePage> = this.searchIcdCodeChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return this.dataSetManagementService.getIcdCodes(1, 10, [
            { key: 'q', value: [value] },
          ]);
        })
      );
    icdList$.subscribe({
      next: (data: any) => {
        this.isLoadingIcdCodes = false;
        this.icdCodeOptionList =
          data?.listOfIcdCodes?.map((item: any) => {
            return {
              value: item.code,
              label: `${item.code}-${item.name}`,
            };
          }) ?? [];
      },
      error: (error: any) => {
        // TODO: Implement error handling
        this.isLoadingIcdCodes = false;
      },
    });
  }

  searchConfigurations() {
    const configurationsList$: Observable<ConfigurationPage> =
      this.searchConfigurationChange$
        .asObservable()
        .pipe(debounceTime(500))
        .pipe(
          switchMap((value: string) => {
            return this.dataSetManagementService.getConfigurations(1, 10, [
              { key: 'q', value: [value] },
              { key: 'group', value: ['MAPPINGS-SETTINGS'] },
            ]);
          })
        );
    configurationsList$.subscribe({
      next: (data: ConfigurationPage) => {
        this.isLoadingConfigurations = false;
        this.configurationOptionList =
          data?.listOfConfigurations?.map((configuration: any) => {
            return {
              value: {
                name: configuration.name,
                options: configuration.options,
              },
              label: configuration.name,
            };
          }) ?? [];
      },
      error: (error: any) => {
        // TODO: Implement error handling
        this.isLoadingConfigurations = false;
      },
    });
  }

  onSelectMappingSetting(event: SelectedSettingOption) {
    this.mappingsData.disagregations.forEach((item) => {
      if (item.categoryOptionComboId === event.categoryOptionComboId) {
        item.configurations?.forEach((config) => {
          if (config.name === event.settingName) {
            config.selectedValue = event.value;
            if (config.name === 'Gender') {
              config.keyToUseInPayload = 'gender';
            }
            if (config.name === 'Agetype') {
              config.keyToUseInPayload = 'ageType';
            }
            if (config.name === 'TEST') {
              config.keyToUseInPayload = 'test';
            }
          }
        });
      }
    });
  }

  createMappingsPayload() {
    const payLoad = {
      mapping: {
        mappings: this.selectedICdCodes.map((item) => {
          return {
            code: item,
          };
        }),

        dataElement: {
          id: this.selectedInputId,
          name: '',
          code: '',
        },
        type: '',
        params: this.mappingsData.disagregations.map((item) => {
          return {
            co: item.categoryOptionComboId,
            ...(item.configurations ?? []).reduce((acc, config: Setting) => {
              if (config.name === 'Agegroup') {
                const startingAge = config.selectedValue?.split('-')[0];
                const endingAge = config.selectedValue?.split('-')[1];
                acc['startAge'] = startingAge;
                acc['endAge'] = endingAge;
              } else {
                acc[config.keyToUseInPayload as string] = config.selectedValue;
              }
              return acc;
            }, {} as { [key: string]: any }),
          };
        }),
      },
      dataKey: this.selectedInputId,
      namespace: `MAPPINGS-${this.dataSetUuid}`,
      description: '',
      group: '',
    };
    return payLoad;
  }

  onSubmitMappings() {
    this.isSubmittingMapping = true;
    const payLoad: any = this.createMappingsPayload();
    let action$: Observable<any>;

    if (this.mappingUuid != null) {
      payLoad.uuid = this.mappingUuid;
      action$ = this.dataSetManagementService.updateMappings(
        payLoad,
        this.mappingUuid
      );
    } else {
      action$ = this.dataSetManagementService.addMappings(payLoad);
    }

    action$.subscribe({
      next: (data: any) => {
        this.isSubmittingMapping = false;
        this.alert = {
          show: true,
          type: 'success',
          message: 'Mapping added successfully',
        };
        // TODO: Handle response
      },
      error: (error: any) => {
        this.isSubmittingMapping = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
        // TODO: Handle error
      },
    });
  }

  deleteMapping() {
    this.isDeletingMapping = true;
    this.dataSetManagementService.deleteMapping(this.mappingUuid!).subscribe({
      next: (data: any) => {
        this.isDeletingMapping = false;
        this.alert = {
          show: true,
          type: 'success',
          message: 'Mapping deleted successfully',
        };
      },
      error: (error: any) => {
        this.isDeletingMapping = false;
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
        // TODO: Handle error
      },
    });
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
