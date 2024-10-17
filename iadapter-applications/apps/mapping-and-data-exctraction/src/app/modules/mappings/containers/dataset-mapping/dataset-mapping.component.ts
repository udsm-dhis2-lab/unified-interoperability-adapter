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
  options: any;
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
  useIcdCodes = false;

  mappingsData: MappingsData = {
    disagregations: [],
  };

  selectedICdCodes: string[] = [];

  disaggregationRowChecked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onDisaggregationRowChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshDisaggregationCheckedStatus();
  }

  onAllDisaggregationRowsChecked(value: boolean): void {
    this.mappingsData.disagregations.forEach((item) =>
      this.updateCheckedSet(item.categoryOptionComboId, value)
    );
    this.refreshDisaggregationCheckedStatus();
  }

  refreshDisaggregationCheckedStatus(): void {
    this.disaggregationRowChecked = this.mappingsData.disagregations.every(
      (item) => this.setOfCheckedId.has(item.categoryOptionComboId)
    );
    this.indeterminate =
      this.mappingsData.disagregations.some((item) =>
        this.setOfCheckedId.has(item.categoryOptionComboId)
      ) && !this.disaggregationRowChecked;
  }

  isLoadingDisaggregation: boolean = false;
  leftColumnSpan: number = 16;
  rightColumnSpan: number = 8;

  dataSetUuid: string = '';
  isLoading: boolean = true;
  datasetFormContent: string = '';
  sanitizedContent!: SafeHtml;

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
    console.log('SELECTED CONFIGURATION', value);
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

  onIcdCodeSelect(value: string[]) {
    this.selectedICdCodes = value;
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
        // const datasetFields = JSON.parse(data.datasetFields);
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
    const inputElements = this.elRef.nativeElement.querySelectorAll('input');
    inputElements.forEach((input: HTMLInputElement) => {
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
          this.isLoadingDisaggregation = false;
          this.mappingsData.disagregations = data.map(
            (item: any) => new Disaggregation(item.id, item.name)
          );
          this.refreshDisaggregationCheckedStatus();
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

  onSelectMappingSetting(event: string) {
    console.log('THIS WAS GIVEN SETTING', event);
  }

  onSubmitMappings() {}
}
