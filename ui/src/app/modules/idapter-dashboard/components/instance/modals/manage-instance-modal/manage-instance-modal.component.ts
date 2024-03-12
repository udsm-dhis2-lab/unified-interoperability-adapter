import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-manage-instance-modal',
  templateUrl: './manage-instance-modal.component.html',
  styleUrls: ['./manage-instance-modal.component.css']
})
export class ManageInstanceModalComponent implements OnInit {

  instances: InstanceInterface[] | undefined;
  instance: InstanceInterface | undefined;
  showAddInstanceForm: boolean = false;
  subscription: Subscription | undefined;
  name: string | undefined;
  message: string | undefined;
  messageType: string | undefined;

 

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


  ngOnInit(): void {
  }



  onToggle() {
    this.uiService?.toggleAddForm();
  }

  addInstance(instance: InstanceInterface): void {
    this.instancesService.addInstance(instance).subscribe({
      next: (instance) => {
        this.instances = [...this.instances!, instance];
        this.message = 'Instance added successfully.';
        this.messageType = 'success';
      },
      error: (error) => {
        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
  }
}
