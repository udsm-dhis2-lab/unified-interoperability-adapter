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

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { DatasetInterface, SourceInterface } from 'src/app/models/source.model';
import {
  InstanceDatasetsInterface,
  InstanceInterface,
} from 'src/app/resources/interfaces';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { DatasetQueriesManagementModalComponent } from 'src/app/shared/modals/dataset-queries-management-modal/dataset-queries-management-modal.component';
import { PlaygroundModalComponent } from 'src/app/shared/modals/playground-modal/playground-modal.component';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css'],
})
export class MappingComponent implements OnInit {
  instance: InstanceInterface | undefined;
  interoperabilityInstances$: Observable<any[]> | undefined;
  instances: InstanceInterface[] | undefined;
  datasets: DatasetInterface[] | undefined;
  datasetsLength: boolean = false;
  dataset: DatasetInterface | undefined;
  message: string | undefined;
  messageType: string | undefined;
  instanceDatasets: InstanceDatasetsInterface[] | undefined;
  dataSources$: Observable<any[]> | undefined;
  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;
  formAttribute: any | undefined;
  isFormReady: boolean = false;
  tableRowsMetadata: any;

  @Output() onViewDataset = new EventEmitter();

  constructor(
    private instancesService: InstancesService,
    private datasetsService: DatasetsService,
    private sourcesService: SourcesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataSources$ = this.sourcesService.getSources();
    this.dataSources$.subscribe({
      next: (sources) => {
        this.sources = sources;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });

    this.interoperabilityInstances$ = this.instancesService.getInstances();
    this.interoperabilityInstances$.subscribe({
      next: (instances) => {
        this.instances = instances;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });

    if (this.datasets) {
      this.datasetsLength = this.datasets!.length > 0 ? true : false;
    }
  }

  onChange() {}

  getFormAttribute(event: MatSelectChange | undefined): void {
    this.formAttribute = event?.value;
    this.isFormReady = false;
    setTimeout(() => {
      this.isFormReady = true;
    });
  }

  onSubmit() {
    const dataSetToView = {
      id: this.dataset?.id,
      instanceId: this.instance?.id,
      name: this.dataset?.displayName,
    };

    this.onViewDataset.emit(this.dataset);

    if (dataSetToView.id) {
      this.message = 'Ready to view the form Design!';
      this.messageType = 'success';
    } else {
      this.message = "No dataset defined. Can't view the form Design!";
      this.messageType = 'danger';
    }
  }

  public filterDatasets() {
    if (this.instance) {
      this.isFormReady = false;
      setTimeout(() => {
        this.isFormReady = this.instance && this.dataset ? true : false;
      }, 100);
      this.datasetsService.getDatasets().subscribe({
        next: (datasets) => {
          this.datasets = (
            datasets.filter(
              (dataset: any) => dataset?.instances?.id === this.instance?.id
            ) || []
          )?.map((dataSet: any) => {
            let dataSetFields: any = {};
            try {
              dataSet?.datasetFields
                ? JSON.parse(dataSet?.datasetFields)
                : null;
            } catch (e) {
              // console.log(e);
            }
            return {
              ...dataSet,
              formDesignCode: dataSet?.formDesignCode
                ? dataSet?.formDesignCode
                : dataSetFields &&
                  dataSetFields?.dataEntryForm &&
                  dataSetFields?.dataEntryForm?.htmlCode
                ? dataSetFields?.dataEntryForm?.htmlCode
                : null,
              datasetFields: dataSetFields,
            };
          });
        },
        error: (error) => {
          (this.message = 'Error: '), error.error.message;
          this.messageType = 'danger';
        },
      });
      this.dataset = undefined;
    } else {
      this.datasets = undefined;
      window.location.reload();
    }
  }

  async checkDataset(dataset: DatasetInterface) {
    this.dataset = undefined;
    await new Promise((resolve) => setTimeout(resolve, 5));
    this.dataset = dataset;
    this.isFormReady = this.instance && this.dataset ? true : false;
  }

  changesOnDataValue(e: Event) {
    console.log(e);
  }

  onOpenPlayGround(
    event: Event,
    interoperabilityInstances: any,
    dataSources: any
  ): void {
    event.stopPropagation();
    this.dialog.open(PlaygroundModalComponent, {
      minWidth: '80%',
      data: {
        interoperabilityInstances,
        dataSources,
      },
    });
  }

  onOpenMappingQueries(
    event: Event,
    instance: any,
    dataSetInstance: any,
    dataSources: any[],
    tableRowsMetadata: any
  ): void {
    event.stopPropagation();
    this.dialog.open(DatasetQueriesManagementModalComponent, {
      minWidth: '80%',
      data: {
        instance,
        dataSetInstance,
        dataSources,
        tableRowsMetadata,
      },
    });
  }

  getTableMetadataReferences(tableRowsMetadata: any): void {
    this.tableRowsMetadata = tableRowsMetadata;
  }
}
