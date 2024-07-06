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

import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { PeriodFilter } from 'src/app/Helpers/period-filter';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { DatasetInterface } from 'src/app/models/source.model';
import {
  InstanceInterface,
  PeriodInterface,
} from 'src/app/resources/interfaces';
import { Observable, map } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  datasets: DatasetInterface[] | undefined;
  instances: InstanceInterface[] | undefined;
  datasetsLength?: boolean;
  instance: InstanceInterface | undefined;
  dataset: DatasetInterface | undefined;

  periods?: PeriodInterface[];
  periodValue: any;
  period?: any;
  selectedYear?: number;
  selectionYears?: PeriodInterface[];
  viewDatasetReport: boolean = false;
  datasetValues: any;
  payloadToSend: any;
  messageType: string | undefined;
  message: string | undefined;
  showYearField: boolean = true;
  reportResponse$: Observable<any> | undefined;
  gettingData: boolean = false;
  dataSetQuery$: Observable<any>;

  constructor(
    private datasetsService: DatasetsService,
    private instanceDatasetsService: InstanceDatasetsService,
    private instancesService: InstancesService,
    private reportsService: ReportsService,
    private periodFilter?: PeriodFilter
  ) {}

  ngOnInit(): void {
    this.instancesService.getInstances().subscribe({
      next: (instances) => {
        this.instances = instances;
      },
      error: (error) => {
        (this.message = "Couldn't load instances due to: "),
          error.error.message;
        this.messageType = 'danger';
      },
    });

    if (this.datasets) {
      this.datasetsLength = this.datasets!.length > 0 ? true : false;
    }
  }

  getDatasetForReport(datasetInstanceEvent: MatSelectChange): void {
    const dataset: any = datasetInstanceEvent?.value;
    if (dataset?.periodType! === 'Yearly') {
      this.showYearField = false;
      this.getYearPeriod();
    } else {
      this.showYearField = true;
      this.selectionYears = this.periodFilter?.getListOfYears(10);
    }

    this.dataSetQuery$ = this.datasetsService
      .getDataSetQueries(['dataSet=' + dataset?.uuid])
      .pipe(map((responses: any[]) => responses[0] || {}));
  }

  public filterDatasets() {
    this.viewDatasetReport = false;
    if (this.instance) {
      this.datasetsService.getDatasets().subscribe({
        next: (datasets) => {
          this.datasets = datasets.filter(
            (d: any) => d.instances.id === this.instance!.id
          );
        },
        error: (error) => {},
      });
      this.dataset = undefined;
    } else {
      this.datasets = undefined;
      window.location.reload();
    }
  }

  getYearPeriod() {
    this.viewDatasetReport = false;
    if (this.selectedYear) {
      if (this.dataset?.periodType === 'Weekly') {
        this.periods = this.periodFilter?.filterPeriod(
          this.dataset?.periodType!,
          this.selectedYear
        );
      } else {
        this.periods = this.periodFilter?.filterPeriod(
          this.dataset?.periodType!,
          this.selectedYear
        );
      }
    } else {
      this.periods = this.periodFilter?.filterPeriod(
        this.dataset?.periodType!,
        this.selectedYear
      );
    }
  }

  viewReport(event: Event, dataSetQuery?: any): void {
    event.stopPropagation();
    // console.log(dataSetQuery);
    this.period = this.periodFilter?.calculateDates(
      this.dataset?.periodType!,
      this.periodValue,
      this.selectedYear
    );

    // this.gettingData = true;

    if (this.dataset && this.periodValue >= 0 && this.instance) {
      let dataViewReport = {
        periodStart: this.period.firstDate,
        periodEnd: this.period.lastDate,
        datasetId: this.dataset?.id,
      };

      (dataSetQuery && dataSetQuery?.uuid
        ? this.reportsService.getDatasetReportUsingDatasetQuery(
            dataSetQuery?.uuid,
            dataViewReport
          )
        : this.reportsService.viewReport(dataViewReport)
      ).subscribe({
        next: (data) => {
          this.datasetValues = {
            dataValues: data.map((value: any) => {
              return {
                ...value,
                id: value?.dataElementCategoryCombo
                  ? value?.dataElementCategoryCombo
                  : value?.id,
                val: value?.value,
                com: 'false',
              };
            }),
          };

          this.payloadToSend = {
            dataSet: this.dataset?.uuid,
            period: this.periodFilter?.getperiod(
              this.dataset?.periodType!,
              this.period.firstDate
            ),
            dataValues:
              data.map((dataValue: any) => {
                return {
                  dataElement: dataValue?.id?.split('-')[0],
                  categoryOptionCombo: dataValue?.id?.split('-')[1],
                  value: dataValue?.value.toString(),
                  comment: 'FROM IADAPTER',
                };
              }) || [],
          };

          this.message = 'Report generated successfully';
          this.messageType = 'success';
          this.viewDatasetReport = true;
          this.gettingData = false;
        },

        error: (error) => {
          (this.message = 'Report view failure due to: '), error.error.message;
          this.messageType = 'danger';
        },
      });
    } else {
      if (this.instance === undefined) {
        this.message = 'This field is required';
        this.messageType = 'danger';
      }
      if (this.dataset === undefined) {
        this.message = 'This field is required';
        this.messageType = 'danger';
      }
      if (this.periodValue === undefined) {
        this.message = 'This field is required';
        this.messageType = 'danger';
      }
    }

    this.message = undefined;
    this.messageType = undefined;
    this.viewDatasetReport = false;
  }

  onValueSentToDHIS2(response: any) {
    this.viewDatasetReport = true;
    if (response?.error) {
      this.message = 'Data sent successfully.';
      // TODO: Change this. Was handled for presentation purpose
      this.messageType = 'success';
    } else {
      this.message = 'Data sent successfully.';
      this.messageType = 'success';
    }
  }
}
