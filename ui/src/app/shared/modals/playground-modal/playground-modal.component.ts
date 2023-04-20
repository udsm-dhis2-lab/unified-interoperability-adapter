import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { formatDateToYYMMDD } from 'src/app/Helpers/format-dates.helper';
import { DataValueFetchService } from 'src/app/services/dataValueFetch/data-value-fetch.service';

@Component({
  selector: 'app-playground-modal',
  templateUrl: './playground-modal.component.html',
  styleUrls: ['./playground-modal.component.css'],
})
export class PlaygroundModalComponent implements OnInit {
  testQuery: string | undefined;
  selectedInstance: any | undefined;
  startDate: any | undefined;
  endDate: any | undefined;
  testQueryResponse$: Observable<any> | undefined;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  today: Date | undefined;
  selectedPage: string | undefined = 'query';
  constructor(
    private dialogRef: MatDialogRef<PlaygroundModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataValueSetsService: DataValueFetchService
  ) {}

  ngOnInit(): void {
    this.today = new Date();
  }

  getSelectedInstance(event: MatSelectChange): void {
    this.selectedInstance = event.value;
    console.log(this.selectedInstance);
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  getStartDate(event: any): void {
    this.startDate = event.value;
  }

  getEndDate(event: any): void {
    this.endDate = event.value;
  }

  onGetTestQuery(event: any): void {
    this.testQuery = (event.target as HTMLInputElement)?.value;
  }

  onRun(event: Event): void {
    event.stopPropagation();
    const payload = {
      datasource: {
        id: this.selectedInstance?.id,
      },
      sql: `${this.testQuery};`,
      periodStart: formatDateToYYMMDD(this.startDate),
      periodEnd: formatDateToYYMMDD(this.endDate),
    };
    this.testQueryResponse$ =
      this.dataValueSetsService.getTestQueryResults(payload);
    this.selectedPage = 'report';
  }

  getPageToShow(event: MatRadioChange): void {
    this.selectedPage = event?.value;
  }
}
