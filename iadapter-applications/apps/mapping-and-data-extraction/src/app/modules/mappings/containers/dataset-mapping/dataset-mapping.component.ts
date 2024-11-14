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
import { ConfigurationPage, IcdCodePage, LoincCodePage } from '../../models';

export interface MappingsData {
  disagregations: Disaggregation[];
}

interface Setting {
  name: string;
  keyToUseInMappings: string;
  selectedValue?: any;
  payLoad?: any;
  options: any;
}

interface SelectedSettingOption {
  value: any;
  categoryOptionComboId: string;
  settingName: string;
  keyToUseInMappings: string;
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

  dataTemplatesBlocks: {
    key: string;
    name: string;
  }[] = [
    {
      key: 'visitDetails',
      name: 'Visit Details',
    },
    {
      key: 'clinicalInformationDetails',
      name: 'Clinical Information Details',
    },
    {
      key: 'vaccinationDetails',
      name: 'Vaccination Details',
    },
  ];

  selectedDataTemplateBlock: string = '';
  onDataTemplateBlockSelect(value: string) {
    this.selectedDataTemplateBlock = value;
  }

  onSearchConfiguration(value: string): void {
    this.isLoadingConfigurations = true;
    this.searchConfigurationChange$.next(value);
  }

  onConfigurationSelect(value: any) {
    this.assignConfigurationToSelectedDisaggregation(value);
  }

  assignConfigurationToSelectedDisaggregation(configuration: {
    name: string;
    keyToUseInMappings: string;
    options: any[];
  }): void {
    this.mappingsData.disagregations.forEach((item) => {
      item.configurations = [
        ...(item.configurations ?? []),
        {
          name: configuration.name,
          keyToUseInMappings: configuration.keyToUseInMappings,
          options: configuration.options,
        },
      ];
    });
  }

  selectedICdCodes: { name: string; code: string }[] = [];
  searchIcdCodeChange$ = new BehaviorSubject('');
  placeHolderForIcdCodeSelect: string = 'Select ICD Code';
  isLoadingIcdCodes: boolean = false;
  selectedIcdCode?: { name: string; code: string };
  icdCodeOptionList: any[] = [];

  selectedLoincCodes: { name: string; code: string }[] = [];
  searchLoincCodeChange$ = new BehaviorSubject('');
  placeHolderForLoincCodeSelect: string = 'Select LOINC Code';
  isLoadingLoincCodes: boolean = false;
  selectedLoincCode?: { name: string; code: string };
  loincCodeOptionList: any[] = [];

  onSearchLoincCode(value: string): void {
    this.isLoadingLoincCodes = true;
    this.searchLoincCodeChange$.next(value);
  }

  onLoincCodeSelect(value: { name: string; code: string }) {
    this.selectedLoincCodes = [...this.selectedLoincCodes, value];
  }

  onRemoveLoincCode(tag: { name: string; code: string }) {
    this.selectedLoincCodes = this.selectedLoincCodes.filter(
      (item) => item.code !== tag.code
    );
  }

  onSearchIcdCode(value: string): void {
    this.isLoadingIcdCodes = true;
    this.searchIcdCodeChange$.next(value);
  }

  onIcdCodeSelect(value: { name: string; code: string }) {
    this.selectedICdCodes = [...this.selectedICdCodes, value];
  }

  onRemoveIcdCode(tag: { name: string; code: string }) {
    this.selectedICdCodes = this.selectedICdCodes.filter(
      (item) => item.code !== tag.code
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
    this.searchLoincCodes();
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
    this.selectedDataTemplateBlock = '';
    this.selectedICdCodes = [];
    this.selectedLoincCodes = [];
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
          console.log('data', data);
          if (data.mapping.type !== '') {
            this.selectedDataTemplateBlock = data.mapping.type;
          }

          if (data.mapping.icdMappings.length > 0) {
            this.selectedICdCodes = data?.mapping?.icdMappings.map(
              (item: any) => item
            );
          }

          if (data.mapping.loincMappings.length > 0) {
            this.selectedLoincCodes = data?.mapping?.loincMappings.map(
              (item: any) => item
            );
          }

          if (data.mapping.params.length > 0) {
            // Consider taking one param, every param have the same number and type of configuration
            // Find respective configurations against the prefetched list of configurations

            const param = data.mapping.params[0];

            let configurations: any[] = [];

            Object.keys(param).forEach((key) => {
              if (key === 'startAge') {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.value.keyToUseInMappings === 'ageGroup'
                );
                this.assignConfigurationToSelectedDisaggregation(
                  configuration.value
                );
                configurations = [configuration];
              } else if (key === 'endAge' || key === 'co') {
                return;
              } else {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.value.keyToUseInMappings === key
                );
                if (configuration) {
                  this.assignConfigurationToSelectedDisaggregation(
                    configuration.value
                  );
                }
                configurations = [...configurations, configuration];
              }
            });

            for (const param of data.mapping.params) {
              Object.keys(param).forEach((key) => {
                if (key === 'endAge' || key === 'co') {
                  return;
                } else if (key === 'startAge') {
                  const configuration = configurations.find(
                    (item: any) => item.value.keyToUseInMappings === 'ageGroup'
                  );
                  const selectedOption = configuration.value.options.find(
                    (item: any) =>
                      item.startAge === param.startAge &&
                      item.endAge === param.endAge
                  );
                  this.onSelectMappingSetting({
                    value: selectedOption,
                    categoryOptionComboId: param.co,
                    settingName: configuration.label,
                    keyToUseInMappings: configuration.value.keyToUseInMappings,
                  });
                } else {
                  const configuration = configurations.find(
                    (item: any) => item.value.keyToUseInMappings === key
                  );
                  if (configuration) {
                    console.log('config', configuration);
                    console.log('valueToSearch', param);
                    const selectedOption = configuration.value.options.find(
                      (item: any) =>
                        item.code ===
                        param[configuration.value.keyToUseInMappings]
                    );
                    console.log('option', selectedOption);
                    this.onSelectMappingSetting({
                      value: selectedOption,
                      categoryOptionComboId: param.co,
                      settingName: configuration.label,
                      keyToUseInMappings:
                        configuration.value.keyToUseInMappings,
                    });
                  }
                }
              });
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
              value: {
                code: item.code,
                name: item.name,
              },
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

  searchLoincCodes() {
    const loincList$: Observable<LoincCodePage> = this.searchLoincCodeChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return this.dataSetManagementService.getLoincCodes(1, 10, [
            { key: 'q', value: [value] },
          ]);
        })
      );
    loincList$.subscribe({
      next: (data: any) => {
        this.isLoadingLoincCodes = false;
        this.loincCodeOptionList =
          data?.listOfLoincCodes?.map((item: any) => {
            return {
              value: {
                code: item.code,
                name: item.name,
              },
              label: `${item.code}-${item.name}`,
            };
          }) ?? [];
      },
      error: (error: any) => {},
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
                keyToUseInMappings: configuration.keyToUseInMappings,
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
            if (event.keyToUseInMappings === 'ageGroup') {
              config.payLoad = {
                startAge: event.value.startAge,
                endAge: event.value.endAge,
              };
            } else {
              config.payLoad = {
                [event.keyToUseInMappings]: event.value.code,
              };
            }
          }
        });
      }
    });
  }

  createMappingsPayload() {
    const payLoad = {
      mapping: {
        icdMappings: this.selectedICdCodes.map((item) => {
          return {
            code: item.code,
            name: item.name,
          };
        }),

        loincMappings: this.selectedLoincCodes.map((item) => {
          return {
            code: item.code,
            name: item.name,
          };
        }),

        dataElement: {
          id: this.selectedInputId,
          name: '',
          code: '',
        },
        type: this.selectedDataTemplateBlock,
        params: this.mappingsData.disagregations.map((item) => {
          return {
            co: item.categoryOptionComboId,
            ...(item.configurations ?? []).reduce((acc, config: Setting) => {
              if (config.payLoad) {
                Object.keys(config.payLoad).forEach((key) => {
                  acc[key] = config.payLoad[key];
                });
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
    this.selectedICdCodes = [];
    this.selectedLoincCodes = [];
    this.selectedDataTemplateBlock = '';
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
