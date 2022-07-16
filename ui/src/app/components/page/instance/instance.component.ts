import { InstancesService } from 'src/app/services/instances/instances.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { UiService } from 'src/app/services/ui.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditInstanceComponent } from './edit-instance/edit-instance.component';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css']
})
export class InstanceComponent implements OnInit {

  instances: InstanceInterface[] | undefined;
  instance: InstanceInterface | undefined;
  showAddInstanceForm: boolean = false;
  subscription: Subscription | undefined;
  name: string | undefined;


  faEdit = faEdit;
  faTrash = faTrash;

  constructor(
    private instancesService: InstancesService, 
    private uiService?: UiService, 
    private router?: Router,
    public dialog?: MatDialog
  ) 
  { 
    this.subscription = this.uiService?.onToggleAddInstanceForm().subscribe((value) => (this.showAddInstanceForm = value));
  }

  ngOnInit(): void {
    this.instancesService.getInstances().subscribe((instances) => (this.instances = instances));
  }

  onToggle(){
    this.uiService?.toggleAddForm();
  }

  onDelete(instance: InstanceInterface) {
    this.instancesService
    .deleteInstance(instance)
    .subscribe(() => (this.instances = this.instances?.filter((i) => i.id !== instance.id)));
    this.router?.navigate(['/instances']);
  }

  // activateInstance(instance: InstanceInterface) {
  //   instance.active = !instance.active;
  //   this.instancesService.updateInstanceActivate(instance).subscribe();
  // } 

  addInstance(instance: InstanceInterface): void{
    this.instancesService.addInstance(instance).subscribe((instance) => (this.instances?.push(instance)));
    
  }


  openDialog(instanceToEdit: InstanceInterface): void {
    const dialogRef = this.dialog?.open(EditInstanceComponent, {
      width: '40%',
      data: instanceToEdit
    });

    console.log("Opened: "+instanceToEdit.url);

    dialogRef?.afterClosed().subscribe(result => {
      if(result){
        console.log("Results: ", result);
          this.instance = result;
          this.instancesService.updateInstance(this.instance!).subscribe();
          this.router?.navigate(['/instances']);
      } 
      else{
        window.location.reload();
      }  

    });
  }
  
}
