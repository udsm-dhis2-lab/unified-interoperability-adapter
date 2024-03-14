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
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  faAdd,
  faCancel,
  faCheck,
  faEdit,
  faMultiply,
  faSubtract,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { DatasetInterface } from 'src/app/models/source.model';
import {
  InstanceInterface,
  InstanceDatasetsInterface,
} from 'src/app/resources/interfaces';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { UiService } from 'src/app/services/ui.service';
import { LoadingComponent } from 'src/app/shared/loader/loading/loading.component';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css'],
})
export class DatasetsComponent implements OnInit {
  instanceDatasets$: Observable<InstanceDatasetsInterface[]> | undefined;
  instanceDatasets: InstanceDatasetsInterface[] | undefined;
  datasets: DatasetInterface[] | undefined;
  subscription: Subscription | undefined;
  instances!: InstanceInterface[];
  instance!: InstanceInterface;

  faEdit = faEdit;
  faTrash = faTrash;
  faAdd = faAdd;
  faSubtract = faSubtract;
  faCheck = faCheck;
  faCancel = faCancel;
  faMultiply = faMultiply;
  datasetName?: string;
  message: string | undefined;
  messageType: string | undefined;

  constructor(
    private datasetsService: DatasetsService,
    private instancesService: InstancesService,
    private instanceDatasetsService: InstanceDatasetsService,
    private uiService?: UiService,
    private router?: Router,
    public dialog?: MatDialog
  ) {}

  ngOnInit(): void {
    this.instancesService.getInstances().subscribe({
      next: (instances) => {
        this.instances = instances;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
    //Get all datasets
    this.datasetsService.getDatasets().subscribe({
      next: (datasets) => {
        this.datasets = datasets;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
  }

  onToggle() {
    this.uiService?.toggleAddDatasetForm();
  }

  onDelete(instanceDataset: InstanceDatasetsInterface) {
    let datasetToDelete = this.datasets?.filter(
      (dataset) => dataset.id === instanceDataset.id
    )[0];
    const confirmationDialog = this.dialog?.open(
      SharedConfirmationModalComponent,
      {
        minWidth: '30%',
        data: {
          title: 'Confirmation',
          message: `Are you sure you want to remove dataset?`,
          color: 'primary',
        },
        enterAnimationDuration: '1200ms',
        exitAnimationDuration: '1200ms',
      }
    );
    confirmationDialog?.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const loadingDialog = this.dialog?.open(LoadingComponent, {
          width: 'auto',
          disableClose: true,
        });
        this.datasetsService.deleteDataset(datasetToDelete!).subscribe({
          next: () => {
            this.datasets = this.datasets?.filter(
              (d: any) => d.id !== datasetToDelete?.id
            );
            loadingDialog?.close();
            this.message = 'Dataset removed successfully.';
            this.messageType = 'success';
            this.router?.navigate(['/datasets']);
          },
          error: (error) => {
            loadingDialog?.close();
            this.message = error.error.message;
            this.messageType = 'danger';
          },
        });
      }
    });
    this.message = undefined;
    this.messageType = undefined;
  }

  addDataset(instanceDataset: InstanceDatasetsInterface) {
    // let instance: InstanceInterface = this.instances.filter(i => i.url === instanceDataset.instanceId)[0];

    const datasetObject = {
      id: instanceDataset.id,
      displayName: instanceDataset.displayName,
      instances: {
        id: this.instance.id,
      },
      formDesignCode: instanceDataset.formDesignCode,
    };

    const confirmationDialog = this.dialog?.open(
      SharedConfirmationModalComponent,
      {
        minWidth: '30%',
        data: {
          title: 'Confirmation',
          message: `Are you sure you want to select dataset?`,
          color: 'primary',
        },
        enterAnimationDuration: '1200ms',
        exitAnimationDuration: '1200ms',
      }
    );
    confirmationDialog?.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const loadingDialog = this.dialog?.open(LoadingComponent, {
          width: 'auto',
          disableClose: true,
        });

        this.datasetsService.addDataset(datasetObject).subscribe({
          next: (dataset) => {
            loadingDialog?.close();
            this.datasets?.push(dataset);
            this.message = 'Dataset selected successfully.';
            this.messageType = 'success';
          },
          error: (error) => {
            loadingDialog?.close();
            this.message = error.error.message;
            this.messageType = 'danger';
          },
        });
      }
    });

    this.message = undefined;
    this.messageType = undefined;
  }

  filterDatasets(instance: InstanceInterface) {
    this.instanceDatasets = undefined;
    this.instanceDatasets$ = this.instanceDatasetsService.getInstanceDatasets(
      instance.id!
    );
    this.instanceDatasets$.subscribe({
      next: (instanceDatasets) => {
        this.instanceDatasets = instanceDatasets;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
    this.instance = instance;
    if (!instance) {
      this.instanceDatasets = undefined;
    }
    this.message = undefined;
    this.messageType = undefined;
  }

  searchInstanceDatasets() {
    if (this.datasetName) {
      this.instanceDatasetsService
        .searchInstanceDatasets(this.instance.id!, this.datasetName!)
        .subscribe({
          next: (instanceDatasets) => {
            this.instanceDatasets = instanceDatasets;
          },
          error: (error) => {
            this.message = error.error.message;
            this.messageType = 'danger';
          },
        });
    } else if (!this.datasetName) {
      this.message = "Can't search null dataset";
      this.messageType = 'danger';
    }
    this.message = undefined;
    this.messageType = undefined;
  }

  datasetExisting(instanceDataset: InstanceDatasetsInterface) {
    return this.datasets?.some((dataset) => dataset.id === instanceDataset.id);
  }
}
