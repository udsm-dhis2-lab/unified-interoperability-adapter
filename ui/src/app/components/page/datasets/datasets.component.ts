import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAdd, faEdit, faSubtract, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { DatasetInterface, InstanceInterface, InstanceDatasetsInterface } from 'src/app/resources/interfaces';
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
    this.instancesService.getInstances().subscribe((instances) => (this.instances = instances));

    //Get all datasets
    this.datasetsService.getDatasets().subscribe((datasets) => (this.datasets = datasets));
  }

  onToggle(){
    this.uiService?.toggleAddDatasetForm();
  }

  onDelete(instanceDataset: InstanceDatasetsInterface) {
    let datasetToDelete = this.datasets?.filter(dataset => dataset.id === instanceDataset.id)[0]

    this.datasetsService
    .deleteDataset(datasetToDelete!)
    .subscribe(() => (this.datasets = this.datasets?.filter((d) => d.id !== datasetToDelete?.id)));
    this.router?.navigate(['/datasets']);
  }

  addDataset(instanceDataset: InstanceDatasetsInterface){
    let instance: InstanceInterface = this.instances.filter(i => i.url === instanceDataset.instanceUrl)[0];
    
    const datasetObject = {
      id: instanceDataset.id,
      name: instanceDataset.name,
      instanceId: instance.id,
      formDesign: instanceDataset.formDesign
    }

    this.datasetsService.addDataset(datasetObject).subscribe((dataset) => (this.datasets?.push(dataset)));
    console.log(datasetObject);
  }

  filterDatasets(instance: InstanceInterface){
    this.instanceDatasetsService.getInstanceDatasets().subscribe((instanceDatasets) => (this.instanceDatasets = instanceDatasets.filter(d => d.instanceUrl === instance.url)));
    if(!instance){
      this.instanceDatasets = undefined;    
    }

  }

  datasetExisting(instanceDataset: InstanceDatasetsInterface){
    return this.datasets?.some(dataset => dataset.id === instanceDataset.id)
  }

}
