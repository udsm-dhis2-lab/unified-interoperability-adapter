import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';

@Component({
  selector: 'app-dataset-queries-management-modal',
  templateUrl: './dataset-queries-management-modal.component.html',
  styleUrls: ['./dataset-queries-management-modal.component.css'],
})
export class DatasetQueriesManagementModalComponent implements OnInit {
  query: string;
  selectedSource: any;
  saving: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datasetsService: DatasetsService
  ) {}

  ngOnInit(): void {}

  onGetEnteredValue(event: KeyboardEvent): void {
    this.query = (event.target as any)?.value;
  }

  onDataSourceSelection(event: MatSelectChange): void {
    this.selectedSource = event?.value;
  }

  onSave(event: Event): void {
    event.stopPropagation();
    const dataSetQuery = {
      sqlQuery: this.query,
      dataSource: {
        uuid: this.selectedSource?.uuid,
      },
      dataSetInstance: {
        uuid: this.data?.dataSetInstance?.uuid,
      },
      instance: {
        uuid: this.data?.instance?.uuid,
      },
    };
    this.saving = true;
    this.datasetsService
      .addDataSetQuery(dataSetQuery)
      .subscribe((response: any) => {
        if (response) {
          this.saving = false;
        } else {
          //TODO: Handle errors
          this.saving = false;
        }
      });
  }
}
