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
} from '../../models';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  Instance,
  InstancePage,
} from 'apps/mapping-and-data-extraction/src/app/shared/models';
import { InstanceManagementService } from 'apps/mapping-and-data-extraction/src/app/shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchBarComponent, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  alert = {
    show: false,
    type: '',
    message: '',
  };

  selectedInstanceFetchingMechanism: string = 'remoteDatasets';
  showMapAsDataSetAction = false;

  @ViewChild('additionalContent') additionalContent!: TemplateRef<any>;
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;

  total = 1;
  listOfDatasets: Dataset[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];
  dataSetSeachQuery: string = '';

  isFirstLoad = true;

  searchInstanceChange$ = new BehaviorSubject('');
  instancesOptionList: Instance[] = [];
  selectedInstance?: string;
  isInstanceFetchingLoading = false;

  constructor(
    private dataSetManagementService: DatasetManagementService,
    private instanceManagementService: InstanceManagementService,
    private router: Router,
    private modal: NzModalService,
    private route: ActivatedRoute
  ) {}

  onInstanceSearch(value: string): void {
    this.isInstanceFetchingLoading = true;
    this.searchInstanceChange$.next(value);
  }

  setDataSetUrl(fetchMechanism: string): string {
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

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      return;
    }
    const { pageSize, pageIndex, filter } = params;
    const queryFilter = [
      ...filter,
      { key: 'instance', value: [this.selectedInstance!] },
      this.dataSetSeachQuery !== ''
        ? { key: 'q', value: [this.dataSetSeachQuery] }
        : { key: 'q', value: [] },
    ];
    this.loadDatasetsFromServer(
      pageIndex,
      pageSize,
      this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
      queryFilter
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['from'] === 'mapping') {
        this.selectedInstanceFetchingMechanism = 'selectedDatasets';
      }
    });
    this.searchInstances();
  }

  /**
   * Search for instances based on the input in the search bar.
   * Debounce for 500ms and fetch the first page of instances.
   * Set the selectedInstance to the first instance in the list :- This is done on first load.
   * Load the datasets for the selected instance.
   */
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
        this.loadDatasetsFromServer(
          this.pageIndex,
          this.pageSize,
          this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
          [{ key: 'instance', value: [this.selectedInstance!] }]
        );
        this.isInstanceFetchingLoading = false;
      }
    });
  }

  /**
   * Load datasets from server when user clicks the search button in the search bar.
   * The filter parameter is set to the selected instance uuid and fetch mechanism that can be
   * either "remoteDatasets" or "selectedDatasets".
   */
  onDatasetsSearch() {
    this.loadDatasetsFromServer(
      1,
      10,
      this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
      [{ key: 'instance', value: [this.selectedInstance!] }]
    );
  }

  /**
   * This function is a callback function for the search input typing event in the
   * search bar. It reloads the datasets table with the search query in the
   * input box.
   *
   * @param value The search query in the input box.
   */
  onDatasetsSearchInputTyping(value: string) {
    this.dataSetSeachQuery = value;
    if (value.length >= 3 || value === '') {
      this.loadDatasetsFromServer(
        1,
        10,
        this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
        [
          { key: 'instance', value: [this.selectedInstance!] },
          value !== '' ? { key: 'q', value: [value] } : { key: 'q', value: [] },
        ]
      );
    }
  }

  dataSetAction(event: {
    dataSetUuid?: string;
    dataSetInstance?: DataSetInstance;
    dataSetId: string;
  }) {
    if (this.selectedInstanceFetchingMechanism === 'selectedDatasets') {
      this.goToDataSetMapping(event.dataSetUuid!);
    } else if (event.dataSetInstance) {
      this.removeDatasetFromMapping(event?.dataSetInstance?.uuid!);
    } else {
      this.selectDatasetForMapping(event.dataSetId, this.selectedInstance!);
    }
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
    this.loadDatasetsFromServer(
      this.pageIndex,
      this.pageSize,
      this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
      [
        { key: 'instance', value: [this.selectedInstance!] },
        this.dataSetSeachQuery !== ''
          ? { key: 'q', value: [this.dataSetSeachQuery] }
          : { key: 'q', value: [] },
      ]
    );
  }

  goToDataSetMapping(uuid: string) {
    this.router.navigate(['mapping-and-data-extraction/dataset-mapping', uuid]);
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
