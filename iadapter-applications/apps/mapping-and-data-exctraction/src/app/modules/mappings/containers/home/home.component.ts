import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from 'search-bar';
import {
  BehaviorSubject,
  debounceTime,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  Dataset,
  DatasetPage,
  Instance,
  InstancePage,
  MappingsUrls,
} from '../../models';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy, OnInit {
  selectedInstanceFetchingMechanism: string = 'remoteDatasets';

  @ViewChild('additionalContent') additionalContent!: TemplateRef<any>;
  @ViewChild(SearchBarComponent) searchBarComponent!: SearchBarComponent;

  total = 1;
  listOfDatasets: Dataset[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterKey = [{}];

  isFirstLoad = true;

  searchInstanceChange$ = new BehaviorSubject('');
  instancesOptionList: Instance[] = [];
  selectedInstance?: string;
  isInstanceFetchingLoading = false;

  constructor(private dataSetManagementService: DatasetManagementService) {}

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
          //TODO: Set total from data after it's support in fhir is implemented
          this.total = data.total; //data.total;
          this.pageIndex = data.pageIndex;
          this.listOfDatasets = data.listOfDatasets;
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
    ];

    this.loadDatasetsFromServer(
      pageIndex,
      pageSize,
      this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
      queryFilter
    );
  }

  ngOnInit(): void {
    this.searchInstances();
  }

  searchInstances() {
    const optionList$: Observable<InstancePage> = this.searchInstanceChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) => {
          return this.dataSetManagementService.getInstances(0, 10, true, []);
        })
      );
    optionList$.subscribe((data) => {
      this.instancesOptionList = data.listOfInstances;
      this.selectedInstance = this.instancesOptionList[0].uuid;
      this.loadDatasetsFromServer(
        1,
        10,
        this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
        [{ key: 'instance', value: [this.selectedInstance!] }]
      );
      this.isInstanceFetchingLoading = false;
    });
  }

  onDatasetsSearch() {
    // TODO: Remove this page variable when all api starts at page 1
    const page =
      this.selectedInstanceFetchingMechanism === 'selectedDatasets' ? 0 : 1;
    this.loadDatasetsFromServer(
      page,
      10,
      this.setDataSetUrl(this.selectedInstanceFetchingMechanism),
      [{ key: 'instance', value: [this.selectedInstance!] }]
    );
  }

  goToDataSetMapping() {}
}
