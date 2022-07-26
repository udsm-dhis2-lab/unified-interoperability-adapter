import { DataValueFetchService } from './../../../../../services/dataValueFetch/data-value-fetch.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatasetInterface, PeriodInterface, SourceInterface } from 'src/app/resources/interfaces';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PeriodFilter } from 'src/app/Helpers/period-filter';

@Component({
  selector: 'app-add-query',
  templateUrl: './add-query.component.html',
  styleUrls: ['./add-query.component.css'],
})
export class AddQueryComponent implements OnInit {
  source: SourceInterface | undefined;
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
  ) {}

  ngOnInit(): void {

    if (this.data.dataset?.periodType! === 'Weekly') {
      this.periods = this.periodFilter?.filterPeriod(this.data.dataset?.periodType!, 2022);
    } else {
      this.periods = this.periodFilter?.filterPeriod(this.data.dataset?.periodType!);
    }

    // this.periods = this.periodFilter?.filterPeriod(
    //   this.data.dataset?.periodType!
    // );
    this.source = this.data.source
    console.log("Source: ",this.source)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveInstance(sourceSelected: SourceInterface): void {
    console.log('On Save ', sourceSelected);
  }

  clearForm() {}

  async onTest() {
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
      periodEnd: dates?.lastDate
    };


    // console.log('Data for testing:', dates);
    this.dataValueFetchService?.testDataValueFetchQuery(dataValueFetchObject).subscribe({
      next: (value) => (this.testValue = value),
      error: (err) => console.log("error occured")
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Data for testing:', this.periodValue);

    this.showTestResults = true;
  }
}

export interface QueryData {
  sources?: SourceInterface[];
  source?: SourceInterface;
  query?: string;
  dataset?: DatasetInterface;
}

