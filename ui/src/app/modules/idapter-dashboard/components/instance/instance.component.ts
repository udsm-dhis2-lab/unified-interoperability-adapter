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

import { InstancesService } from 'src/app/services/instances/instances.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { UiService } from 'src/app/services/ui.service';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditInstanceComponent } from './edit-instance/edit-instance.component';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';

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
        this.message = "Couldn't find instances";
        this.messageType = 'danger';
      },
    });
  }

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  onDelete(instance: InstanceInterface) {
    this.dialog?.open(SharedConfirmationModalComponent, {
      minWidth: '30%',
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to delete ${instance.name} source?`,
        color: 'primary'
      },
      enterAnimationDuration: '1200ms',
      exitAnimationDuration: '1200ms'
    }).afterClosed().subscribe((confirmed?: boolean) => {
    if(confirmed){
    this.instancesService.deleteInstance(instance).subscribe({
      next: () => {
        this.instances = this.instances?.filter((i) => i.id !== instance.id);
        this.message = 'Instance deleted successfully.';
        this.messageType = 'success';
      },
      error: (error) => {
        this.message = "Couldn't delete instance";
        this.messageType = 'danger';
      },
    });
    this.router?.navigate(['/instances']);
  }
  })
  }


//   onDelete(source: SourceInterface) {
//     this.dialog?.open(SharedConfirmationModalComponent, {
//       minWidth: '30%',
//       data: {
//         title: 'Confirmation',
//         message: `Are you sure you want to delete ${source.url} source?`,
//         color: 'primary'
//       },
//       enterAnimationDuration: '1200ms',
//       exitAnimationDuration: '1200ms'
//     }).afterClosed().subscribe((confirmed?: boolean) => {
//       if (confirmed) {
//         this.sourcesService.deleteSource(source).subscribe({
//           next: () => {
//             this.sources = this.sources?.filter((s) => s.id !== source.id);
//             this.message = 'Source deleted successfully.';
//             this.messageType = 'success';
//           },
//           error: (error) => {
//             this.message = "Couldn't delete the source.";
//             this.messageType = 'danger';
//           },
//         });
//         this.router?.navigate(['/sources']);
//         this.message = undefined;
//         this.messageType = undefined;
//       }
//     })

// }


  // activateInstance(instance: InstanceInterface) {
  //   instance.active = !instance.active;
  //   this.instancesService.updateInstanceActivate(instance).subscribe();
  // }

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

  openDialog(instanceToEdit: InstanceInterface): void {
    const dialogRef = this.dialog?.open(EditInstanceComponent, {
      minWidth: '40%',
      data: instanceToEdit,
    });

    dialogRef?.afterClosed().subscribe((result) => {
      if (result) {
        if (result.username && result.password && result.name && result.url) {
          this.instance = result;
          this.instancesService.updateInstance(this.instance!).subscribe({
            next: (value) => {
              this.message = 'Instance updated successfully.';
              this.messageType = 'success';
            },
            error: (error) => {
              (this.message = 'Failed to update instance due to: '),
                error.error.message;
              this.messageType = 'danger';
            },
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
