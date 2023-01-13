import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Data } from '@angular/router';
import { DatasetInterface, SourceInterface } from 'src/app/models/source.model';
import { InstanceDatasetsInterface, InstanceInterface } from 'src/app/resources/interfaces';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { InstanceDatasetsService } from 'src/app/services/instanceDataset/instance-dataset.service';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { SourcesService } from 'src/app/services/sources/sources.service';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.css']
})
export class MappingComponent implements OnInit {
  
  instance: InstanceInterface | undefined;
  instances: InstanceInterface[] | undefined;
  datasets: DatasetInterface[] | undefined;
  datasetsLength: boolean = false; 
  dataset: DatasetInterface | undefined;
  message: string | undefined;
  messageType: string | undefined;
  instanceDatasets: InstanceDatasetsInterface[] | undefined
  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;

  @Output() onViewDataset = new EventEmitter();



  constructor(
      private instancesService: InstancesService, 
      private datasetsService: DatasetsService,
      private instanceDatasetsService: InstanceDatasetsService,
      private sourcesService: SourcesService,
      
    ) { }

  ngOnInit(): void {
    
    
    this.sourcesService.getSources().subscribe({
      next: (sources) => {
        this.sources = sources
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = "danger"
      }
    });

    this.instancesService.getInstances().subscribe({
      next: (instances) => {
        this.instances = instances;
      },
      error: (error) => {
         this.message = error.error.message;
         this.messageType = "danger";
      }
    });   
    
    if (this.datasets){
      this.datasetsLength = this.datasets!.length > 0 ? true : false;
    }

 }


  onChange(){
  }

  onSubmit(){
      const dataSetToView = {
        id: this.dataset?.id,
        instanceId: this.instance?.id,
        name: this.dataset?.displayName
    }

    this.onViewDataset.emit(this.dataset)
    
    if(dataSetToView.id){
      this.message = "Ready to view the form Design!" 
      this.messageType = "success"; 
    }
    else{
      this.message = "No dataset defined. Can't view the form Design!" 
      this.messageType = "danger";
    }

  }

  public filterDatasets(){
    
    if(this.instance){
      this.datasetsService.getDatasets().subscribe({
        next: (datasets) => {
          this.datasets = datasets.filter((d: any) => d.instances.id === this.instance!.id)
        },
        error: (error) => {
          this.message = 'Error: ', error.error.message;
          this.messageType = 'danger';
        }
      });
      this.dataset = undefined;
    }
    else{
      this.datasets = undefined;
      window.location.reload();
    }
  }

  async checkDataset(dataset: DatasetInterface){
    this.dataset = undefined

    await new Promise((resolve) => setTimeout(resolve, 5));

    this.dataset = dataset
  }
  
  changesOnDataValue(e: Event){
  }

}


