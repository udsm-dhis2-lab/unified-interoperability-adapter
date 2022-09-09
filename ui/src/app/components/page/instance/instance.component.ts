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
  styleUrls: ['./instance.component.css'],
})
export class InstanceComponent implements OnInit {
  instances: InstanceInterface[] | undefined;
  instance: InstanceInterface | undefined;
  showAddInstanceForm: boolean = false;
  subscription: Subscription | undefined;
  name: string | undefined;
  message: string | undefined;
  messageType: string | undefined;

  faEdit = faEdit;
  faTrash = faTrash;

  constructor(
    private instancesService: InstancesService,
    private uiService?: UiService,
    private router?: Router,
    public dialog?: MatDialog
  ) {
    this.subscription = this.uiService?.onToggleAddInstanceForm().subscribe({
      next: (value) => (this.showAddInstanceForm = value),
      error: (e) => console.log(e.message),
    });
  }

   ngOnInit() {
    this.instancesService.getInstances().subscribe({
      next: (instances) => {
        this.instances = instances;

        if (this.instances) {
          this.showAddInstanceForm = false;
        } else this.showAddInstanceForm = true;
      },
      error: (error) => {
        this.message = 'Couldn\'t find instances';
        this.messageType = 'danger';
      }
    });
  }

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  onDelete(instance: InstanceInterface) {
    this.instancesService
      .deleteInstance(instance)
      .subscribe({
          next: () => {
            this.instances = this.instances?.filter((i) => i.id !== instance.id);
            this.message = "Instance deleted successfully.";
            this.messageType = 'success';
          },
          error: (error) => {
              this.message = "Couldn't delete instance"
              console.log(error.error.message);
              this.messageType = 'danger';
          },
        }
      );
    this.router?.navigate(['/instances']);
  }

  // activateInstance(instance: InstanceInterface) {
  //   instance.active = !instance.active;
  //   this.instancesService.updateInstanceActivate(instance).subscribe();
  // }

  addInstance(instance: InstanceInterface): void {
    this.instancesService.addInstance(instance).subscribe({
      next: (instance) => {
        this.instances = [...this.instances!, instance];
        this.message = "Instance added successfully.";
        this.messageType = 'success';
      },
      error: (error) => {
        this.message = error.error.message
        this.messageType = "danger"
      }
    });
  }

  openDialog(instanceToEdit: InstanceInterface): void {
    const dialogRef = this.dialog?.open(EditInstanceComponent, {
      width: '40%',
      data: instanceToEdit,
    });

    console.log('Opened: ' + instanceToEdit.url);

    dialogRef?.afterClosed().subscribe((result) => {
      if (result) {
        if (result.username && result.password && result.name && result.url) {
          console.log(
            `Results: ,
            ${result.username} && ${result.password} && ${result.name} && ${result.url} `
          );
          this.instance = result;
          this.instancesService.updateInstance(this.instance!).subscribe({
            next: (value) => {
              this.message = 'Instance updated successfully.';
              this.messageType = 'success';
            },
            error: (error) => {
              this.message = 'Failed to update instance due to: ', error.error.message;
              this.messageType = 'danger';
            }
          });
        } else {
          this.message = 'Failed to update instance.';
          this.messageType = 'danger';
        }
      } else {
        window.location.reload();
      }
    });
    this.message = undefined;
    this.messageType = undefined;
  }
}
