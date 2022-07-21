import { DatasetInterface, InstanceInterface, PeriodInterface } from './../../../resources/interfaces';
import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { PeriodFilter } from 'src/app/Helpers/period-filter';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { map } from 'lodash';
import { subscribeOn } from 'rxjs';

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
  viewDatasetReport: boolean = false;
  datasetValues: any;

  constructor(
    private datasetsService: DatasetsService,
    private instanceDatasetsService: InstanceDatasetsService,
    private instancesService: InstancesService,
    private reportsService: ReportsService,
    private periodFilter?: PeriodFilter
  ) {}

  ngOnInit(): void {
    this.instancesService
      .getInstances()
      .subscribe((instances) => (this.instances = instances));

    if (this.datasets) {
      this.datasetsLength = this.datasets!.length > 0 ? true : false;
    }
  }

  public filterDatasets() {
    this.viewDatasetReport = false;
    if (this.instance) {
      this.datasetsService
        .getDatasets()
        .subscribe(
          (datasets) =>
            (this.datasets = datasets.filter(
              (d) => d.instances.id === this.instance!.id
            ))
        );
      this.dataset = undefined;
    } else {
      this.datasets = undefined;
      window.location.reload();
    }
  }


  checkDataset(dataset: DatasetInterface) {
    this.viewDatasetReport = false;
    this.dataset = dataset;
    this.periods = this.periodFilter?.filterPeriod(this.dataset?.periodType!);
  }

  async viewReport(){
    this.period = this.periodFilter?.calculateDates(this.dataset?.periodType!, this.periodValue);
    console.log(this.period)

    let dataViewReport = {
      periodStart: this.period.firstDate,
      periodEnd: this.period.lastDate,
      datasetId: this.dataset?.id,
    }
    console.log(this.periodValue)
    if (this.dataset && this.periodValue >= 0  && this.instance){
      // this.reportsService
      //   .viewReport(dataViewReport)
      //   .subscribe(
      //     (data: any) =>
      //       console.log(data)
      //   );
      // this.viewDatasetReport = true;
      let datasetValues;
      this.reportsService.viewReport(dataViewReport).subscribe(
        (data) =>
          (datasetValues = data.map((value: any) => {
            return {
              id: value.dataElementCategoryCombo,
              val: value.value,
              com: 'false',
            }
            ;
          }))
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      this.datasetValues  = {
        dataValues: datasetValues
      }
      this.viewDatasetReport = true;
    }
    console.log(this.datasetValues);

  }

}


