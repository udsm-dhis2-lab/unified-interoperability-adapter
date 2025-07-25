import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SearchBarComponent } from '../../../../../../../../libs/search-bar/src/lib/search-bar/search-bar.component';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import {
  Dataset,
  DataSetInstance,
  DatasetPage,
  MappingsUrls,
  Program,
  ProgramPage,
} from '../../models';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ProgramManagementService } from '../../services/program-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  Instance,
  InstancePage,
} from 'apps/mapping-and-data-extraction/src/app/shared/models';
import { InstanceManagementService } from 'apps/mapping-and-data-extraction/src/app/shared';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, SharedModule, NzTabsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  alert = {
    show: false,
    type: '',
    message: '',
  };

  // Tab management
  selectedDataType: 'aggregate' | 'individual' = 'aggregate';
  selectedTabIndex: number = 0;

  selectedInstanceFetchingMechanism: string = 'remoteDatasets';
  showMapAsDataSetAction = false;

  @ViewChild('additionalContent') additionalContent!: TemplateRef<any>;
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;

  // Dataset-related properties
  total = 1;
  listOfDatasets: Dataset[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];
  dataSetSeachQuery: string = '';

  // Program-related properties
  listOfPrograms: Program[] = [];
  programSearchQuery: string = '';

  isFirstLoad = true;

  searchInstanceChange$ = new BehaviorSubject('');
  instancesOptionList: Instance[] = [];
  selectedInstance?: string;
  isInstanceFetchingLoading = false;

  constructor(
    private dataSetManagementService: DatasetManagementService,
    private programManagementService: ProgramManagementService,
    private instanceManagementService: InstanceManagementService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute
  ) { }

  onInstanceSearch(value: string): void {
    this.isInstanceFetchingLoading = true;
    this.searchInstanceChange$.next(value);
  }

  onDataTypeChange(dataType: 'aggregate' | 'individual'): void {
    this.selectedDataType = dataType;
    this.selectedTabIndex = dataType === 'aggregate' ? 0 : 1;
    this.loading = true;
    this.pageIndex = 1;

    this.dataSetSeachQuery = '';
    this.programSearchQuery = '';

    if (dataType === 'individual') {
      this.selectedInstanceFetchingMechanism = 'remoteDatasets';
      this.showMapAsDataSetAction = false;
    }

    if (this.selectedInstance) {
      this.loadAppropriateData();
    }
  }

  onTabChange(index: number): void {
    const dataType: 'aggregate' | 'individual' = index === 0 ? 'aggregate' : 'individual';
    this.onDataTypeChange(dataType);
  }

  get searchLabel(): string {
    return this.selectedDataType === 'aggregate' ? 'Search Dataset:' : 'Search Program:';
  }

  private loadAppropriateData(): void {
    if (this.selectedDataType === 'aggregate') {
      this.loadDatasetsFromServer(
        this.pageIndex,
        this.pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [{ key: 'instance', value: [this.selectedInstance!] }]
      );
    } else {
      this.loadProgramsFromServer(
        this.pageIndex,
        this.pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [{ key: 'instance', value: [this.selectedInstance!] }]
      );
    }
  }

  setDataUrl(fetchMechanism: string, dataType: 'aggregate' | 'individual'): string {
    if (dataType === 'individual') {
      return MappingsUrls.GET_PROGRAMS_REMOTE;
    }

    switch (fetchMechanism) {
      case 'remoteDatasets':
        return MappingsUrls.GET_DATASETS_REMOTE;
      case 'selectedDatasets':
        return MappingsUrls.GET_DATASETS_SELECTED;
      default:
        return '';
    }
  }
  ngAfterViewInit(): void {
    this.searchBarComponent.setAdditionalContent(this.additionalContent);
  }

  ngOnDestroy(): void {
    if (this.loadDatasetsSubscription) {
      this.loadDatasetsSubscription.unsubscribe();
    }
    if (this.loadProgramsSubscription) {
      this.loadProgramsSubscription.unsubscribe();
    }
  }

  loadDatasetsSubscription!: Subscription;

  loadDatasetsFromServer(
    pageIndex: number,
    pageSize: number,
    dataSetsUrl: string,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadDatasetsSubscription = this.dataSetManagementService
      .getDatasets(pageIndex, pageSize, dataSetsUrl, filter)
      .subscribe({
        next: (data: DatasetPage) => {
          this.loading = false;
          this.total = data.total;
          this.pageIndex = data.pageIndex;
          this.pageSize = data.pageSize;
          this.listOfDatasets = data.listOfDatasets;
          this.selectedInstanceFetchingMechanism === 'selectedDatasets'
            ? (this.showMapAsDataSetAction = true)
            : (this.showMapAsDataSetAction = false);
        },
        error: (error) => {
          this.loading = false;
          //TODO: Implement error handling
        },
      });
  }

  loadProgramsSubscription!: Subscription;

  loadProgramsFromServer(
    pageIndex: number,
    pageSize: number,
    programsUrl: string,
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadProgramsSubscription = this.programManagementService
      .getPrograms(pageIndex, pageSize, programsUrl, filter)
      .subscribe({
        next: (data: ProgramPage) => {
          this.loading = false;
          this.total = data.total;
          this.pageIndex = data.pageIndex;
          this.pageSize = data.pageSize;
          this.listOfPrograms = data.listOfPrograms;
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
    const queryFilter = [
      ...filter,
      { key: 'instance', value: [this.selectedInstance!] },
      this.selectedDataType === 'aggregate' && this.dataSetSeachQuery !== ''
        ? { key: 'q', value: [this.dataSetSeachQuery] }
        : this.selectedDataType === 'individual' && this.programSearchQuery !== ''
          ? { key: 'q', value: [this.programSearchQuery] }
          : { key: 'q', value: [] },
    ];

    if (this.selectedDataType === 'aggregate') {
      this.loadDatasetsFromServer(
        pageIndex,
        pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        queryFilter
      );
    } else {
      this.loadProgramsFromServer(
        pageIndex,
        pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        queryFilter
      );
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['from'] === 'mapping') {
        this.selectedInstanceFetchingMechanism = 'selectedDatasets';
      }
    });
    this.searchInstances();
  }

  searchInstances() {
    const optionList$: Observable<InstancePage> = this.searchInstanceChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return this.instanceManagementService.getInstances(1, 10, true, []);
        })
      );

    optionList$.subscribe({
      next: (data: any) => {
        this.instancesOptionList = data.listOfInstances;
        this.isInstanceFetchingLoading = false;
      },
      error: (error: any) => {
        // TODO: Implement error handling
        this.isInstanceFetchingLoading = false;
      },
    });

    optionList$.pipe(take(1)).subscribe((data: any) => {
      if (this.instancesOptionList.length > 0) {
        this.selectedInstance = this.instancesOptionList[0].uuid;
        this.loadAppropriateData();
        this.isInstanceFetchingLoading = false;
      }
    });
  }

  onDatasetsSearch() {
    if (this.selectedDataType === 'aggregate') {
      this.loadDatasetsFromServer(
        1,
        10,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [{ key: 'instance', value: [this.selectedInstance!] }]
      );
    } else {
      this.loadProgramsFromServer(
        1,
        10,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [{ key: 'instance', value: [this.selectedInstance!] }]
      );
    }
  }

  onDatasetsSearchInputTyping(value: string) {
    if (this.selectedDataType === 'aggregate') {
      this.dataSetSeachQuery = value;
    } else {
      this.programSearchQuery = value;
    }

    if (value.length >= 3 || value === '') {
      if (this.selectedDataType === 'aggregate') {
        this.loadDatasetsFromServer(
          1,
          10,
          this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
          [
            { key: 'instance', value: [this.selectedInstance!] },
            value !== '' ? { key: 'q', value: [value] } : { key: 'q', value: [] },
          ]
        );
      } else {
        this.loadProgramsFromServer(
          1,
          10,
          this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
          [
            { key: 'instance', value: [this.selectedInstance!] },
            value !== '' ? { key: 'q', value: [value] } : { key: 'q', value: [] },
          ]
        );
      }
    }
  }

  dataSetAction(event: {
    dataSetUud?: string;
    dataSetInstance?: DataSetInstance;
    dataSetId: string;
  }) {
    if (this.selectedInstanceFetchingMechanism === 'selectedDatasets') {
      this.goToDataSetMapping({ uuid: event.dataSetUud!, id: event.dataSetId });
    } else if (event.dataSetInstance) {
      this.removeDatasetFromMapping(event?.dataSetInstance?.uuid!);
    } else {
      this.selectDatasetForMapping(event.dataSetId, this.selectedInstance!);
    }
  }

  programAction(event: { programId: string }) {
    this.goToProgramMapping({ id: event.programId });
  }

  selectDatasetForMapping(datasetUuid: string, instanceUuid: string) {
    this.dataSetManagementService
      .selectDatasetForMapping(instanceUuid, datasetUuid)
      .subscribe({
        next: (data: any) => {
          // TODO: Handle success
          this.alert = {
            show: true,
            type: 'success',
            message: 'Added dataset to mapping successfully',
          };
          this.reLoadDataSets();
        },
        error: (error: any) => {
          // TODO: Implement error handling
          this.alert = {
            show: true,
            type: 'success',
            message: error.message,
          };
        },
      });
  }

  removeDatasetFromMapping(datasetUuid: string) {
    this.modal.warning({
      nzTitle: 'Do you want to remove this dataset?',
      nzOkText: 'Yes',
      nzOnOk: () => this.onRemoveDatasetConfirm(datasetUuid),
    });
  }

  onRemoveDatasetConfirm(uuid: string) {
    this.dataSetManagementService.removeDatasetForMapping(uuid).subscribe({
      next: (data: any) => {
        // TODO: Handle success
        this.alert = {
          show: true,
          type: 'success',
          message: 'Removed dataset from mapping successfully',
        };
        this.reLoadDataSets();
      },
      error: (error: any) => {
        this.alert = {
          show: true,
          type: 'error',
          message: error.message,
        };
      },
    });
  }

  reLoadDataSets() {
    if (this.selectedDataType === 'aggregate') {
      this.loadDatasetsFromServer(
        this.pageIndex,
        this.pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [
          { key: 'instance', value: [this.selectedInstance!] },
          this.dataSetSeachQuery !== ''
            ? { key: 'q', value: [this.dataSetSeachQuery] }
            : { key: 'q', value: [] },
        ]
      );
    } else {
      this.loadProgramsFromServer(
        this.pageIndex,
        this.pageSize,
        this.setDataUrl(this.selectedInstanceFetchingMechanism, this.selectedDataType),
        [
          { key: 'instance', value: [this.selectedInstance!] },
          this.programSearchQuery !== ''
            ? { key: 'q', value: [this.programSearchQuery] }
            : { key: 'q', value: [] },
        ]
      );
    }
  }

  goToDataSetMapping(dataSetIds: { uuid: string; id: string }) {
    this.router.navigate(['mapping-and-data-extraction/dataset-mapping'], {
      queryParams: dataSetIds,
    });
  }

  goToProgramMapping(programIds: { id: string }) {
    this.router.navigate(['mapping-and-data-extraction/program-mapping'], {
      queryParams: programIds,
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
