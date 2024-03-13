import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, map } from 'rxjs';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';

@Component({
  selector: 'app-dataset-queries-management-modal',
  templateUrl: './dataset-queries-management-modal.component.html',
  styleUrls: ['./dataset-queries-management-modal.component.css'],
})
export class DatasetQueriesManagementModalComponent implements OnInit {
  query: string;
  selectedSource: string;
  saving: boolean = false;
  dataSetQuery$: Observable<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datasetsService: DatasetsService
  ) {}

  ngOnInit(): void {
    // console.log(this.data);
    this.getDataSetQuery();
  }

  getDataSetQuery(): void {
    this.dataSetQuery$ = this.datasetsService
      .getDataSetQueries(['dataSet=' + this.data?.dataSetInstance?.uuid])
      .pipe(map((responses: any[]) => responses[0] || {}));
  }

  onGetEnteredValue(event: KeyboardEvent): void {
    this.query = (event.target as any)?.value;
  }

  onDataSourceSelection(event: MatSelectChange): void {
    this.selectedSource = event?.value;
  }

  onSave(event: Event, savedDataSetQuery: any): void {
    event.stopPropagation();
    const dataSetQuery = {
      sqlQuery: this.query ? this.query : savedDataSetQuery?.sqlQuery,
      dataSource: {
        uuid: this.selectedSource,
      },
      dataSetInstance: {
        uuid: this.data?.dataSetInstance?.uuid,
      },
      instance: {
        // TODO: Possible duplicate since dataSetInstance already has instance
        uuid: this.data?.instance?.uuid,
      },
      uuid: savedDataSetQuery?.uuid ? savedDataSetQuery?.uuid : null,
    };
    this.saving = true;
    this.datasetsService
      .saveDataSetQuery(dataSetQuery)
      .subscribe((response: any) => {
        if (response) {
          this.saving = false;
        } else {
          //TODO: Handle errors
          this.getDataSetQuery();
          this.saving = false;
        }
      });
  }
}
