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
import { Subscription } from 'rxjs';
import { SourceInterface } from 'src/app/models/source.model';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { UiService } from 'src/app/services/ui.service';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from 'src/app/shared/loader/loading/loading.component';

@Component({
  selector: 'app-manage-sources-modal',
  templateUrl: './manage-sources-modal.component.html',
  styleUrls: ['./manage-sources-modal.component.css'],
})
export class ManageSourcesModalComponent implements OnInit {
  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;
  showAddSourceForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;
  messageType: string | undefined;

  constructor(
    private _snackBar: MatSnackBar,
    private sourcesService: SourcesService,
    private uiService?: UiService,
    private router?: Router,
    public dialog?: MatDialog,
    public dialogRef?: MatDialogRef<ManageSourcesModalComponent>
  ) {
    this.subscription = this.uiService?.onToggleAddForm().subscribe({
      next: (value) => {
        this.showAddSourceForm = value;
      },
      error: (error) => {},
    });
  }

  ngOnInit(): void {}

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  addSource(source: SourceInterface) {
    this.dialog
      ?.open(SharedConfirmationModalComponent, {
        minWidth: '30%',
        data: {
          title: 'Confirmation',
          message: `Are you sure you want to save data?`,
          color: 'primary',
        },
        enterAnimationDuration: '1200ms',
        exitAnimationDuration: '1200ms',
      })
      .afterClosed()
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          const loadingDialog = this.dialog?.open(LoadingComponent, {
            width: 'auto',
            disableClose: true,
          });
          this.sourcesService.addSource(source).subscribe({
            next: () => {
              loadingDialog?.close();
              this.dialogRef?.close(true);
              this.openSnackBar('source saved successfuly', '');
            },
            error: (error) => {
              loadingDialog?.close();
              this.message = error.error.message;
              this.messageType = 'danger';
            },
          });
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
