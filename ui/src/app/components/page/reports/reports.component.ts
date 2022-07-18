import { DatasetInterface, InstanceInterface } from './../../../resources/interfaces';
import { Component, OnInit } from '@angular/core';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';

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

  constructor(
    private datasetsService: DatasetsService,
    private instanceDatasetsService: InstanceDatasetsService,
    private instancesService: InstancesService
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
    this.dataset = dataset;
    console.log(this.dataset);
  }
}
