import { InstancesService } from 'src/app/services/instances/instances.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatasetInterface, InstanceInterface } from 'src/app/resources/interfaces';
import { DatasetsService } from 'src/app/services/datasets/datasets.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-dataset',
  templateUrl: './add-dataset.component.html',
  styleUrls: ['./add-dataset.component.css']
})
export class AddDatasetComponent implements OnInit {

  name: string = "";

  instance: InstanceInterface | undefined;

  @Input() instances: InstanceInterface[] | undefined;


  subscription: Subscription | undefined;

  @Output() onAddDataset: EventEmitter<DatasetInterface> = new EventEmitter();
  @Output() onfilterDatasets: EventEmitter<InstanceInterface> = new EventEmitter();
  loading: any;
  
  constructor(private uiService?: UiService) {
   }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = this.uiService?.loading$;
    }, 0);
  }
  

  filterDatasets(){
    this.onfilterDatasets.emit(this.instance)
    console.log("Firing: ",this.instance?.name)
  }

  onSubmit(){
  const newDataset = {
    displayName: this.name,
    instances: {
      id: this.instance?.id
    }
  }

  this.onAddDataset.emit(newDataset);

  this.name = '';
  this.instance = undefined;
}

}
