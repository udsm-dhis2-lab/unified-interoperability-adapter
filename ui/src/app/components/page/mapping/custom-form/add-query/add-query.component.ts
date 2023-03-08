/* BSD 3-Clause License

Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { DataValueFetchService } from './../../../../../services/dataValueFetch/data-value-fetch.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeriodInterface } from 'src/app/resources/interfaces';
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
  selectedSource: any;
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
      this.periods = this.periodFilter?.filterPeriod(
        this.data.dataset?.periodType!,
        new Date().getFullYear()
      );
    } else {
      this.periods = this.periodFilter?.filterPeriod(
        this.data.dataset?.periodType!,
        new Date().getFullYear()
      );
    }
    // this.periods = this.periodFilter?.filterPeriod(
    //   this.data.dataset?.periodType!
    // );
    this.selectedSource =
      this.data && this.data.source && this.data.source.type
        ? this.data.source.type
        : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDataSourceSelection(event: any) {
    // this.selectedSource = event && event.value ? event.value : "";
    this.data.source = event && event.value ? event.value : '';
    let source = this.data.sources?.filter(
      (source) => source.type === event.value
    )[0];
    this.data.source = source;
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
          this.message =
            'Query ran successfully. View results and confirm before saving.';
          this.messageType = 'success';
        },
        error: (err) => {
          this.testValue = err.error.message;
          this.message =
            'This query results to an error. View the message from the results field';
          this.messageType = 'danger';
        },
      });

    this.message = undefined;
    this.messageType = undefined;
    this.showTestResults = true;
  }
}
