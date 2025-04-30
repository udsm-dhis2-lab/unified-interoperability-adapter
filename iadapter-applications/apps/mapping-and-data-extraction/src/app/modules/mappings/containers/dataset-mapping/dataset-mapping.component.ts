import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectComponent } from 'apps/mapping-and-data-extraction/src/app/shared/components';
import { BehaviorSubject, debounceTime, Observable, switchMap } from 'rxjs';
import {
  ConfigurationPage,
  Field,
  IcdCodePage,
  LoincCodePage,
  queryOperators,
} from '../../models';

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
  newThisYear?: boolean = false;
  newVisit?: boolean = false;

  useSum?: boolean = false;
  freeTextQuery?: boolean = false;

  lhsQueryValue?: any;
  rhsQueryValue?: any;
  rhsInputValue?: any;
  nodes = [];

  queries: any[] = [];
  customQuery?: string = '';

  get queriesAsString(): string {
    return JSON.stringify(this.queries, null, 2);
  }

  onQueryChange(event: any) {
    this.queries = JSON.parse(event.target.value);
  }

  onAddQuery() {
    let primitiveValue: any;

    const trimmedValue = this.rhsInputValue?.trim();

    const parsedValue = parseFloat(trimmedValue);

    if (!isNaN(parsedValue)) {
      primitiveValue = parsedValue;
    } else if (
      trimmedValue?.toLowerCase() === 'true' ||
      trimmedValue?.toLowerCase() === 'false'
    ) {
      primitiveValue = trimmedValue?.toLowerCase() === 'true';
    } else {
      primitiveValue = trimmedValue;
    }

    var query = {
      leftSideQuery: {
        type: 'tableField',
        value: this.lhsQueryValue,
      },
      operator: this.selectedQueryOperator,
      rightSideQuery: this.rhsQueryValue
        ? {
          type: 'tableField',
          value: this.rhsQueryValue,
        }
        : {
          type: 'primitiveValue',
          value: primitiveValue,
        },
    };
    this.queries = [...this.queries, query];
    this.lhsQueryValue = null;
    this.rhsInputValue = null;
    this.rhsQueryValue = null;
    this.selectedQueryOperator = '';
  }

  queryOperators = queryOperators;

  selectedQueryOperator: string = '';
  onQueryOperatorSelect(value: string) {
    this.selectedQueryOperator = value;
  }

  isSubmittingMapping: boolean = false;
  isDeletingMapping: boolean = false;
  mappingUuid?: string;

  alert = {
    show: false,
    type: '',
    message: '',
  };

  mappingsData: MappingsData = {
    disagregations: [],
  };

  isLoadingDisaggregation: boolean = false;
  leftColumnSpan: number = 16;
  rightColumnSpan: number = 8;

  dataSetIds: { uuid: string; id: string } = { uuid: '', id: '' };
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

  onRemoveConfiguration(configurationName: any) {
    this.mappingsData.disagregations.forEach((item) => {
      item.configurations = item.configurations?.filter(
        (configuration) => configuration.name !== configurationName
      );
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
  placeHolderForLoincCodeSelect: string = 'Select LOINC Code (Order)';
  isLoadingLoincCodes: boolean = false;
  selectedLoincCode?: { name: string; code: string };
  loincCodeOptionList: any[] = [];

  selectedLoincCodesObs: { name: string; code: string }[] = [];
  searchLoincCodeChangeObs$ = new BehaviorSubject('');
  placeHolderForLoincCodeSelectObs: string = 'Select LOINC Code (Obs)';
  isLoadingLoincCodesObs: boolean = false;
  selectedLoincCodeObs?: { name: string; code: string };
  loincCodeOptionListObs: any[] = [];

  selectedMsdCodes: { name: string; code: string }[] = [];
  searchMsdCodesChange$ = new BehaviorSubject('');
  placeHolderForMsdCodes: string = 'Select Msd Codes';
  isLoadingMsdCodes: boolean = false;
  selectedMsdCode?: { name: string; code: string };
  msdCodesOptionList: any[] = [];

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

  onSearchLoincCodeObs(value: string): void {
    this.isLoadingLoincCodesObs = true;
    this.searchLoincCodeChangeObs$.next(value);
  }

  onLoincCodeSelectObs(value: { name: string; code: string }) {
    this.selectedLoincCodesObs = [...this.selectedLoincCodesObs, value];
  }

  onRemoveLoincCodeObs(tag: { name: string; code: string }) {
    this.selectedLoincCodesObs = this.selectedLoincCodesObs.filter(
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

  onSearchMsdCode(value: string): void {
    this.isLoadingMsdCodes = true;
    this.searchMsdCodesChange$.next(value);
  }

  onMsdCodeSelect(value: { name: string; code: string }) {
    this.selectedMsdCodes = [...this.selectedMsdCodes, value];
  }

  onRemoveMsdCode(tag: { name: string; code: string }) {
    this.selectedMsdCodes = this.selectedMsdCodes.filter(
      (item) => item.code !== tag.code
    );
  }

  constructor(
    private route: ActivatedRoute,
    private dataSetManagementService: DatasetManagementService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.dataSetIds = {
        uuid: params['uuid'],
        id: params['id'],
      };
    });
    this.searchIcdCode();
    this.searchConfigurations();
    this.searchLoincCodes();
    this.searchLoincCodesObs();
    this.searchMsdCodes();
    this.getFlatTablesFromDatastore();
    this.loadDatasetByIdFromServer(this.dataSetIds.uuid);
  }

  loadDatasetByIdFromServer(uuid: string) {
    this.dataSetManagementService.getDatasetById(uuid).subscribe({
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
    this.selectedICdCodes = [];
    this.selectedLoincCodes = [];
    this.selectedLoincCodesObs = [];
    this.selectedMsdCodes = [];
    this.queries = [];
    this.newThisYear = false;
    this.newVisit = false;
    this.mappingUuid = undefined;
    this.freeTextQuery = false;
    this.customQuery = '';
    this.useSum = false;
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
            this.getExistingMappings(this.selectedInputId, this.dataSetIds.id);
          }
        },
        error: (error: any) => {
          this.isLoadingDisaggregation = false;
          this.alert = {
            show: true,
            type: 'error',
            message: error.message,
          };
          // TODO: Handle error
        },
      });
  }

  getExistingMappings(selectedInputId: string, datasetId: string) {
    this.dataSetManagementService
      .getExistingMappings(selectedInputId, datasetId)
      .subscribe({
        next: (data: any) => {
          if (data.uuid === null) return;
          this.mappingUuid = data.uuid;

          if (data?.mapping?.icdMappings?.length > 0) {
            this.selectedICdCodes = data?.mapping?.icdMappings.map(
              (item: any) => item
            );
          }

          if (data?.mapping?.loincMappings?.length > 0) {
            this.selectedLoincCodes = data?.mapping?.loincMappings.map(
              (item: any) => item
            );
          }

          if (data?.mapping?.queries?.length > 0) {
            this.queries = data?.mapping?.queries;
          }

          if (data?.mapping?.freeTextQuery) {
            this.freeTextQuery = data?.mapping?.freeTextQuery;
          }

          if (data?.mapping?.customQuery) {
            this.customQuery = data?.mapping?.customQuery ?? '';
          }

          if (data?.mapping?.useSum) {
            this.useSum = data?.mapping?.useSum;
          }

          if (data?.mapping?.newThisYear) {
            this.newThisYear = data?.mapping?.newThisYear;
          }

          if (data?.mapping?.newVisit) {
            this.newVisit = data?.mapping?.newVisit;
          }

          if (data?.mapping?.loincObsMappings?.length > 0) {
            this.selectedLoincCodesObs = data?.mapping?.loincObsMappings.map(
              (item: any) => item
            );
          }

          if (data?.mapping?.msdMappings?.length > 0) {
            this.selectedMsdCodes = data?.mapping?.msdMappings.map(
              (item: any) => item
            );
          }

          if (data?.mapping?.params?.length > 0) {
            // Let's find a param with many keys than others
            let maxKeys = 0;
            let maxKeysParam: any = null;
            for (const param of data.mapping.params) {
              if (Object.keys(param).length > maxKeys) {
                maxKeys = Object.keys(param).length;
                maxKeysParam = param;
              }
            }

            const param = maxKeysParam;

            Object.keys(param).forEach((key) => {
              if (key === 'startAge') {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.value.keyToUseInMappings === 'ageGroup'
                );
                this.assignConfigurationToSelectedDisaggregation(
                  configuration.value
                );
              } else if (key === 'endAge' || key === 'co' || key === 'higherWeight') {
                return;
              } else if (key === 'lowerWeight') {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.value.keyToUseInMappings === 'weightGroup'
                );
                this.assignConfigurationToSelectedDisaggregation(
                  configuration.value
                );
              } else {
                const configuration = this.configurationOptionList.find(
                  (item: any) => item.value.keyToUseInMappings === key
                );
                if (configuration) {
                  this.assignConfigurationToSelectedDisaggregation(
                    configuration.value
                  );
                }
              }
            });

            for (const param of data.mapping.params) {
              Object.keys(param).forEach((key) => {
                if (key === 'endAge' || key === 'co' || key === 'higherWeight') {
                  return;
                } else if (key === 'startAge') {
                  const configuration = this.configurationOptionList.find(
                    (item: any) => item.value.keyToUseInMappings === 'ageGroup'
                  );
                  const selectedOption = configuration.value.options.find(
                    (item: any) =>
                      item.startAge === param.startAge &&
                      item.endAge === param.endAge
                  );
                  if (selectedOption) {
                    this.onSelectMappingSetting({
                      value: selectedOption,
                      categoryOptionComboId: param.co,
                      settingName: configuration.label,
                      keyToUseInMappings:
                        configuration.value.keyToUseInMappings,
                    });
                  }
                } else if (key === 'lowerWeight') {
                  const configuration = this.configurationOptionList.find(
                    (item: any) => item.value.keyToUseInMappings === 'weightGroup'
                  );
                  const selectedOption = configuration.value.options.find(
                    (item: any) =>
                      item.lowerWeight === param.lowerWeight &&
                      item.higherWeight === param.higherWeight
                  );
                  if (selectedOption) {
                    this.onSelectMappingSetting({
                      value: selectedOption,
                      categoryOptionComboId: param.co,
                      settingName: configuration.label,
                      keyToUseInMappings:
                        configuration.value.keyToUseInMappings,
                    });
                  }
                } else {
                  const configuration = this.configurationOptionList.find(
                    (item: any) => item.value.keyToUseInMappings === key
                  );
                  if (configuration) {
                    const selectedOption = configuration.value.options.find(
                      (item: any) =>
                        item.code ===
                        param[configuration.value.keyToUseInMappings]
                    );
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
      error: (error: any) => { },
    });
  }

  searchLoincCodesObs() {
    const loincList$: Observable<LoincCodePage> = this.searchLoincCodeChangeObs$
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
        this.isLoadingLoincCodesObs = false;
        this.loincCodeOptionListObs =
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
      error: (error: any) => { },
    });
  }

  searchMsdCodes() {
    const msdList$: Observable<LoincCodePage> = this.searchMsdCodesChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return this.dataSetManagementService.getMsdCodes(1, 10, [
            { key: 'q', value: [value] },
          ]);
        })
      );
    msdList$.subscribe({
      next: (data: any) => {
        this.isLoadingMsdCodes = false;
        this.msdCodesOptionList =
          data?.listOfMsdCodes?.map((item: any) => {
            return {
              value: {
                code: item.code,
                name: item.name,
              },
              label: `${item.code}-${item.name}`,
            };
          }) ?? [];
      },
      error: (error: any) => { },
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

  getFlatTablesFromDatastore() {
    const msdList$ = this.dataSetManagementService.getFlatViewsTables(
      1,
      20,
      []
    );
    msdList$.subscribe({
      next: (data: any) => {
        this.nodes =
          data?.listOfFlatViewsTables?.map((item: any) => {
            return {
              title: item.tableName,
              key: item.tableCode,
              children: item?.fields?.map((field: Field) => {
                return {
                  title: field.name,
                  key: {
                    code: field.code,
                    name: field.name,
                    type: field.type,
                    table: field.table,
                  },
                  isLeaf: true,
                };
              }),
            };
          }) ?? [];
      },
      error: (error: any) => { },
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
        queries: this.queries,
        newThisYear: this.newThisYear,
        newVisit: this.newVisit,
        useSum: this.useSum,
        freeTextQuery: this.freeTextQuery,
        customQuery: this.customQuery,

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

        loincObsMappings: this.selectedLoincCodesObs.map((item) => {
          return {
            code: item.code,
            name: item.name,
          };
        }),

        msdMappings: this.selectedMsdCodes.map((item) => {
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
        params: this.mappingsData.disagregations
          .map((item) => {
            const reducedConfig = (item.configurations ?? []).reduce(
              (acc, config: Setting) => {
                if (config.payLoad) {
                  Object.keys(config.payLoad).forEach((key) => {
                    acc[key] = config.payLoad[key];
                  });
                }
                return acc;
              },
              {} as { [key: string]: any }
            );

            return {
              co: item.categoryOptionComboId,
              ...reducedConfig,
            };
          })

      },
      dataKey: this.selectedInputId,
      namespace: `MAPPINGS-${this.dataSetIds.id}`,
      description: '',
      group: '',
    };
    this.selectedICdCodes = [];
    this.selectedLoincCodes = [];
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

  goBackToDatasetList() {
    this.router.navigate(['mapping-and-data-extraction'], {
      queryParams: { from: 'mapping' },
    });
  }
}
