import { values } from 'lodash';
import { DataValueFetchService } from './../../../../../services/dataValueFetch/data-value-fetch.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeriodInterface  } from 'src/app/resources/interfaces';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PeriodFilter } from 'src/app/Helpers/period-filter';
import { QueryData, SourceInterface } from 'src/app/models/source.model';
import { interval } from 'rxjs';

@Component({
  selector: 'app-add-query',
  templateUrl: './add-query.component.html',
  styleUrls: ['./add-query.component.css'],
})
export class AddQueryComponent implements OnInit {
  selectedSource: string | undefined;
  query: string | undefined;
  showTestResults: boolean = false;
  message: string | undefined;
  messageType: string | undefined;
  testValue: string | undefined;

  faTimes = faTimes;
  periods?: PeriodInterface[];
  periodValue: any;
  period?: PeriodInterface;

  constructor(
    public dialogRef: MatDialogRef<AddQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryData,
    private dataValueFetchService?: DataValueFetchService,
    private periodFilter?: PeriodFilter
  ) {
  }

  ngOnInit(): void {
    if (this.data.dataset?.periodType! === 'Weekly') {
      this.periods = this.periodFilter?.filterPeriod(
        this.data.dataset?.periodType!,
        2022
      );
    } else {
      this.periods = this.periodFilter?.filterPeriod(
        this.data.dataset?.periodType!
      );
    }

    // this.periods = this.periodFilter?.filterPeriod(
    //   this.data.dataset?.periodType!
    // );
    this.selectedSource =  this.data && this.data.source && this.data.source.type? this.data.source.type : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDataSourceSelection(event: any){
    this.selectedSource = event && event.value ? event.value : "";
    console.log(event.value)
  }

  onSaveInstance(sourceSelected: SourceInterface): void {
    console.log('On Save ', sourceSelected);
  }

  onTest() {
    let dates = this.periodFilter?.calculateDates(
      this.data.dataset?.periodType!,
      this.periodValue
    );

    const dataValueFetchObject = {
      dataElementCategoryOptionCombo: undefined,
      sqlQuery: this.data.query,
      datasets: {
        id: undefined,
      },
      datasource: {
        id: this.data.source?.id,
      },
      periodStart: dates?.firstDate,
      periodEnd: dates?.lastDate,
    };
    
    this.dataValueFetchService
      ?.testDataValueFetchQuery(dataValueFetchObject)
      .subscribe({
        next: (value) => {
          this.testValue = value;
          this.message = 'Query ran successfully. View results and confirm before saving.';
          this.messageType = 'success';
        },
        error: (err) => {
          this.testValue = err.error.message;
          this.message = "This query results to an error. View the message from the results field";
          this.messageType= "danger"
        },
      });

    this.message = undefined
    this.messageType = undefined
    this.showTestResults = true;
  }
}


