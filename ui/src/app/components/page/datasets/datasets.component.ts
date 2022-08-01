import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAdd, faCancel, faCheck, faEdit, faMultiply, faSubtract, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DatasetInterface } from 'src/app/models/source.model';
import { InstanceInterface, InstanceDatasetsInterface } from 'src/app/resources/interfaces';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrls: ['./datasets.component.css']
})
export class DatasetsComponent implements OnInit {

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
      private router?: Router
    ) 
    { 
      
    }

  ngOnInit(): void {
    this.instancesService.getInstances().subscribe({
     next: (instances) => {
        this.instances = instances;
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      }
    }
    );
    //Get all datasets
    this.datasetsService.getDatasets().subscribe({
      next: (datasets) => {
        this.datasets = datasets
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      }
    });
  }

  onToggle(){
    this.uiService?.toggleAddDatasetForm();
  }

  onDelete(instanceDataset: InstanceDatasetsInterface) {
    let datasetToDelete = this.datasets?.filter(dataset => dataset.id === instanceDataset.id)[0]

    this.datasetsService.deleteDataset(datasetToDelete!).subscribe({
      next: () => {
        this.datasets = this.datasets?.filter(
          (d: any) => d.id !== datasetToDelete?.id
        );
        this.message = 'Dataset removed successfully.';
        this.messageType = 'success';
        this.router?.navigate(['/datasets']);
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
    this.message = undefined;
    this.messageType = undefined;
  }

  addDataset(instanceDataset: InstanceDatasetsInterface){
    // let instance: InstanceInterface = this.instances.filter(i => i.url === instanceDataset.instanceId)[0];
    
    const datasetObject = {
      id: instanceDataset.id,
      displayName: instanceDataset.displayName,
      instances: {
        id: this.instance.id
      },
      formDesign: instanceDataset.formDesign
    }

    this.datasetsService.addDataset(datasetObject).subscribe({
      next: (dataset) => {
          this.datasets?.push(dataset);
          this.message = "Dataset selected successfully.";
          this.messageType = "success"
        },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = "danger"
      }
    })
    
    this.message = undefined;
    this.messageType = undefined;
  }

  filterDatasets(instance: InstanceInterface){
    this.instanceDatasetsService.getInstanceDatasets(instance.id!).subscribe({
      next: (instanceDatasets) => {
        this.instanceDatasets = instanceDatasets;
      },
      error: (error) => { 
        this.message = error.error.message;
        this.messageType = 'danger';
      } 
    });
    this.instance = instance
    if(!instance){
      this.instanceDatasets = undefined;    
    }
    this.message =undefined;
    this.messageType = undefined;
  }
  
  searchInstanceDatasets(){
    if(this.datasetName){
      this.instanceDatasetsService.searchInstanceDatasets(this.instance.id!, this.datasetName!).subscribe({
        next: (instanceDatasets) => {
          this.instanceDatasets = instanceDatasets 
        },
        error: (error) => {
          this.message = error.error.message;
          this.messageType = "danger";
        }
      });
    }
    else if(!this.datasetName) {
      this.message = 'Can\'t search null dataset';
      this.messageType = 'danger';
    }
     this.message = undefined;
     this.messageType = undefined;
  
  }

  datasetExisting(instanceDataset: InstanceDatasetsInterface){
    return this.datasets?.some(dataset => dataset.id === instanceDataset.id)
  }

}
