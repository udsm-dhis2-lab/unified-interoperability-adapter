import {
  InstanceInterface,
  PeriodInterface,
} from './../../../resources/interfaces';
import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { PeriodFilter } from 'src/app/Helpers/period-filter';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { map } from 'lodash';
import { subscribeOn } from 'rxjs';
import { DatasetInterface } from 'src/app/models/source.model';

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
  sendingObject: any;
  messageType: string | undefined;
  message: string | undefined;
  showYearField: boolean = true;

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

  getSelectionYears() {
    if (this.dataset?.periodType! === 'Yearly') {
      this.showYearField = false;
      this.checkDataset();
    } else {
      this.showYearField = true;
      this.selectionYears = this.periodFilter?.getListOfYears(10);
    }
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

  checkDataset() {
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

  viewReport() {
    this.period = this.periodFilter?.calculateDates(
      this.dataset?.periodType!,
      this.periodValue,
      this.selectedYear
    );

    if (this.dataset && this.periodValue >= 0 && this.instance) {
      let dataViewReport = {
        periodStart: this.period.firstDate,
        periodEnd: this.period.lastDate,
        datasetId: this.dataset?.id,
      };

      this.reportsService.viewReport(dataViewReport).subscribe({
        next: (data) => {
          this.datasetValues = {
            dataValues: data.map((value: any) => {
              return {
                id: value.dataElementCategoryCombo,
                val: value.value,
                com: 'false',
              };
            }),
          };

          this.sendingObject = {
            periodStart: this.period.firstDate,
            periodEnd: this.period.lastDate,
            datasetId: this.dataset?.id,
            period: this.periodFilter?.getperiod(
              this.dataset?.periodType!,
              this.period.firstDate
            ),
          };

          this.message = 'Report view granted.';
          this.messageType = 'success';
          this.viewDatasetReport = true;
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
      this.message = response?.message;
      // TODO: Change this. Was handled for presentation purpose
      this.messageType = 'success';
    } else {
      this.message = 'Data sent successfully.';
      this.messageType = 'success';
    }
  }
}
