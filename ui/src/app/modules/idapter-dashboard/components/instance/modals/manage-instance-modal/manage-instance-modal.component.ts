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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { InstancesService } from 'src/app/services/instances/instances.service';
import { UiService } from 'src/app/services/ui.service';
import { LoadingComponent } from 'src/app/shared/loader/loading/loading.component';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';

@Component({
  selector: 'app-manage-instance-modal',
  templateUrl: './manage-instance-modal.component.html',
  styleUrls: ['./manage-instance-modal.component.css'],
})
export class ManageInstanceModalComponent implements OnInit {
  instances: InstanceInterface[] = [];
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
    public dialog?: MatDialog,
    public dialogRef?: MatDialogRef<ManageInstanceModalComponent>
  ) {
    this.subscription = this.uiService?.onToggleAddInstanceForm().subscribe({
      next: (value) => (this.showAddInstanceForm = value),
      error: (e) => console.log(e.message),
    });
  }
  ngOnInit(): void {}

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  addInstance(instance: InstanceInterface): void {
    const dialogRef = this.dialog?.open(SharedConfirmationModalComponent, {
      minWidth: '30%',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to save data?',
        color: 'primary',
      },
      enterAnimationDuration: '1200ms',
      exitAnimationDuration: '1200ms',
    });
    dialogRef?.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        const loadingDialog = this.dialog?.open(LoadingComponent, {
          width: 'auto',
          disableClose: true,
        });
        this.instancesService.addInstance(instance).subscribe({
          next: (newInstance) => {
            this.instances = [...this.instances, newInstance];
            loadingDialog?.close();
            this.dialogRef?.close(true);
          },
          error: (error) => {
            loadingDialog?.close();
          },
        });
      }
    });
  }
}
