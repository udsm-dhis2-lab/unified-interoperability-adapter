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
import { Dataset, DatasetPage, Instance, InstancePage } from '../../models';
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

  onInstanceSearch(value: string): void {
    this.isInstanceFetchingLoading = true;
    this.searchInstanceChange$.next(value);
  }

  constructor(private dataSetManagementService: DatasetManagementService) {}
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
    filter: Array<{ key: string; value: string[] }>
  ): void {
    this.loading = true;
    this.loadDatasetsSubscription = this.dataSetManagementService
      .getDatasets(pageIndex, pageSize, filter)
      .subscribe({
        next: (data: DatasetPage) => {
          this.loading = false;
          //TODO: Set total from data after it's support in fhir is implemented
          this.total = 4000; //data.total;
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
    this.loadDatasetsFromServer(pageIndex, pageSize, filter);
  }

  ngOnInit(): void {
    // this.loadDatasetsFromServer(this.pageIndex, this.pageSize, []);
    this.searchInstances();
  }

  searchInstances() {
    const optionList$: Observable<InstancePage> = this.searchInstanceChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(
        switchMap((value: string) =>
          this.dataSetManagementService.getInstances(1, 10, true, [])
        )
      );
    optionList$.subscribe((data) => {
      this.instancesOptionList = data.listOfInstances;
      this.isInstanceFetchingLoading = false;
    });
  }

  goToDataSetMapping() {}
}
