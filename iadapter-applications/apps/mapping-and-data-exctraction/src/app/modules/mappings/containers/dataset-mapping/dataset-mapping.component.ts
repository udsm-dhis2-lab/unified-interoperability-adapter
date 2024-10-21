import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SelectComponent } from 'apps/mapping-and-data-exctraction/src/app/shared/components';
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

  assignConfigurationToSelectedDisaggregation(configuration: any[]): void {
    this.mappingsData.disagregations.forEach((item) => {
      if (!item.configurations) {
        item.configurations = [];
      }
      item.configurations = [
        ...item.configurations,
        {
          name: configuration[0],
          selectedValue: '',
          options: configuration[1],
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
    this.dataSetManagementService
      .getCategoryOptionCombos(this.selectedInputId)
      .subscribe({
        next: (data: any) => {
          this.mappingsData.disagregations = [];

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
        },
        error: (error: any) => {
          this.isLoadingDisaggregation = false;
          // TODO: Handle error
        },
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
              value: [configuration.name, configuration.options],
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
        mappings: [
          this.selectedICdCodes.map((item) => {
            return {
              code: item,
            };
          }),
        ],
        dataElement: {
          id: this.selectedInputId,
          name: '',
          code: '',
        },
        type: '',
        params: [
          this.mappingsData.disagregations.map((item) => {
            return {
              co: item.categoryOptionComboId,
              ...(item.configurations ?? []).reduce((acc, config: Setting) => {
                if (config.name === 'Agegroup') {
                  const startingAge = config.selectedValue?.split('-')[0];
                  const endingAge = config.selectedValue?.split('-')[1];
                  acc['startAge'] = startingAge;
                  acc['endAge'] = endingAge;
                } else {
                  acc[config.keyToUseInPayload as string] =
                    config.selectedValue;
                }
                return acc;
              }, {} as { [key: string]: any }),
            };
          }),
        ],
      },
      dataKey: this.selectedInputId,
      namespace: `MAPPINGS-${this.selectedInputId}`,
      description: '',
      group: '',
    };
    return payLoad;
  }

  onSubmitMappings() {
    this.isSubmittingMapping = true;
    const payLoad: any = this.createMappingsPayload();
    this.dataSetManagementService.addMappings(payLoad).subscribe({
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

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
