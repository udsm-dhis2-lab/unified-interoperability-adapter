import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable, map } from 'rxjs';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { flatten } from 'lodash';

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
  showValidationContainer: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datasetsService: DatasetsService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.getDataSetQuery();
  }

  getDataSetQuery(): void {
    this.dataSetQuery$ = this.datasetsService
      .getDataSetQueries(['dataSet=' + this.data?.dataSetInstance?.uuid])
      .pipe(map((responses: any[]) => responses[0] || {}));
    this.dataSetQuery$.subscribe((response: any) => {
      if (response) {
        this.query = response?.sqlQuery;
        this.selectedSource = response?.dataSource?.uuid;
      }
    });
  }

  onGetEnteredValue(event: KeyboardEvent): void {
    this.query = (event.target as any)?.value;
  }

  onDataSourceSelection(event: MatSelectChange): void {
    this.selectedSource = event?.value;
  }

  onSave(event: Event, savedDataSetQuery: any): void {
    event.stopPropagation();
    let dataSetQuery: any = {
      sqlQuery: this.query ? this.query : savedDataSetQuery?.sqlQuery,
      dataSource: {
        uuid: this.selectedSource,
      },
      dataSetInstance: {
        uuid: this.data?.dataSetInstance?.uuid,
      },
      mappings: this.getDatasetQueryOutputMapping(this.data?.tableRowsMetadata),
      instance: {
        // TODO: Possible duplicate since dataSetInstance already has instance
        uuid: this.data?.instance?.uuid,
      },
    };
    if (savedDataSetQuery?.uuid) {
      dataSetQuery['uuid'] = savedDataSetQuery?.uuid;
    }
    this.saving = true;
    this.datasetsService
      .saveDataSetQuery(dataSetQuery)
      .subscribe((response: any) => {
        if (response) {
          this.getDataSetQuery();
          this.saving = false;
        } else {
          //TODO: Handle errors
          this.getDataSetQuery();
          this.saving = false;
        }
      });
  }

  onToggleValidate(event: Event): void {
    event.stopPropagation();
    this.showValidationContainer = !this.showValidationContainer;
  }

  getDatasetQueryOutputMapping(tableRowsMetadata: any): string {
    const mappings: any[] = flatten(
      tableRowsMetadata
        .filter((tableRow: any) => tableRow?.queryRowReference > 0)
        .map((tableRow: any) => {
          return (
            tableRow?.cells?.filter(
              (cell: any) => cell?.queryOutputReference
            ) || []
          )?.map((cell: any) => {
            return {
              row: tableRow?.queryRowReference,
              column: cell?.queryOutputReference,
              de: cell?.id.split('-')[0],
              co: cell?.id.split('-')[1],
            };
          });
        })
    );

    return JSON.stringify(mappings);
  }
}
