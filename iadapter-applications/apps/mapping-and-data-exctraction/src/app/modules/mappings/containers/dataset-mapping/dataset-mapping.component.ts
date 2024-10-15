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
import { ConfigurationPage, IcdCodePage, Option } from '../../models';

export interface MappingsData {
  dataElements: string[];
  configurations: string[];
  icdCodes: string[];
}

@Component({
  selector: 'app-dataset-mapping',
  standalone: true,
  imports: [SharedModule, SelectComponent],
  templateUrl: './dataset-mapping.component.html',
  styleUrl: './dataset-mapping.component.css',
})
export class DatasetMappingComponent implements OnInit {
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

  searchIcdCodeChange$ = new BehaviorSubject('');
  placeHolderForIcdCodeSelect: string = 'Select ICD Code';
  isLoadingIcdCodes: boolean = false;
  selectedIcdCode?: string;
  icdCodeOptionList: any[] = [];

  onSearchIcdCode(value: string): void {
    this.isLoadingIcdCodes = true;
    this.searchIcdCodeChange$.next(value);
  }

  mappingsData: MappingsData = {
    dataElements: [],
    configurations: [],
    icdCodes: [],
  };

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
        console.log(
          'DATA SET FIELDS',
          data.datasetFields.dataEntryForm.htmlCode
        );
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

  selectDatasetForMapping(datasetUuid: string, instanceUuid: string) {
    this.dataSetManagementService
      .selectDatasetForMapping(instanceUuid, datasetUuid)
      .subscribe({
        next: (data: any) => {
          // TODO: Handle success
        },
        error: (error: any) => {
          this.isLoading = false;
          // TODO: Implement error handling
        },
      });
  }

  removeDatasetFromMapping(datasetUuid: string) {
    this.dataSetManagementService
      .removeDatasetForMapping(datasetUuid)
      .subscribe({
        next: (data: any) => {
          // TODO: Handle success
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
    const inputElement = event.target as HTMLInputElement;
    const inputId = inputElement.id;
    this.selectedInputId = inputId;
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
            ]);
          })
        );
    configurationsList$.subscribe({
      next: (data: ConfigurationPage) => {
        this.isLoadingConfigurations = false;
        this.configurationOptionList =
          data?.listOfConfigurations?.map((configuration: any) => {
            configuration.options.map((option: Option) => {
              return {
                value: option.code,
                label: `${option.code}-${option.name}`,
              };
            });
          }) ?? [];
      },
      error: (error: any) => {
        console.log('ERRROOOORRRRR', error);
        // TODO: Implement error handling
        this.isLoadingConfigurations = false;
      },
    });
  }
}
