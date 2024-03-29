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
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { EditSourceComponent } from './edit-source/edit-source.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SourceInterface } from 'src/app/models/source.model';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';
import { ManageSourcesModalComponent } from './modals/manage-sources-modal/manage-sources-modal.component';
import { LoadingComponent } from 'src/app/shared/loader/loading/loading.component';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css'],
})
export class SourcesComponent implements OnInit {
  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;
  showAddSourceForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;
  messageType: string | undefined;

  faEdit = faEdit;
  faTrash = faTrash;

  constructor(
    private sourcesService: SourcesService,
    private uiService?: UiService,
    private router?: Router,
    public dialog?: MatDialog
  ) {
    this.subscription = this.uiService?.onToggleAddForm().subscribe({
      next: (value) => {
        this.showAddSourceForm = value;
      },
      error: (error) => {},
    });
  }

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources(): void {
    const loadingDialog = this.dialog?.open(LoadingComponent, {
      width: 'auto',
      disableClose: true,
    });
    this.sourcesService.getSources().subscribe({
      next: (sources) => {
        if (loadingDialog) {
          loadingDialog.close();
        }
        this.sources = sources;
        this.showAddSourceForm = !this.sources;
      },
      error: (error) => {
        if (loadingDialog) {
          loadingDialog.close();
        }
        this.message = "Couldn't load sources";
        this.messageType = 'danger';
      },
    });
  }

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  onDelete(source: SourceInterface) {
    const confirmationDialog = this.dialog?.open(
      SharedConfirmationModalComponent,
      {
        minWidth: '30%',
        data: {
          title: 'Confirm delete',
          message: `Are you sure you want to delete ${source.url} source?`,
          color: 'primary',
        },
        enterAnimationDuration: '1200ms',
        exitAnimationDuration: '1200ms',
      }
    );

    confirmationDialog?.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        const loadingDialog = this.dialog?.open(LoadingComponent, {
          width: 'auto',
          disableClose: true,
        });

        this.sourcesService.deleteSource(source).subscribe({
          next: () => {
            this.sources = this.sources?.filter((s) => s.id !== source.id);
            this.message = 'Source deleted successfully.';
            this.messageType = 'success';
          },
          error: (error) => {
            this.message = "Couldn't delete the source.";
            this.messageType = 'danger';
          },
          complete: () => {
            loadingDialog?.close();
          },
        });

        this.router?.navigate(['/sources']);
        this.message = undefined;
        this.messageType = undefined;
      }
    });
  }

  onOpenDataSourceModal(event: Event): void {
    this.dialog
      ?.open(ManageSourcesModalComponent, {
        width: '900px',
      })
      .afterClosed()
      .subscribe((loadSources?: boolean) => {
        console.log('den', loadSources);
        if (loadSources) {
          this.loadSources();
        }
      });
  }

  openDialog(sourceToEdit: SourceInterface): void {
    const editDialog = this.dialog?.open(EditSourceComponent, {
      width: '50%',
      data: sourceToEdit,
    });

    editDialog
      ?.afterClosed()
      .subscribe((result: SourceInterface | undefined) => {
        if (result) {
          const confirmationDialog = this.dialog?.open(
            SharedConfirmationModalComponent,
            {
              minWidth: '30%',
              data: {
                title: 'Confirmation',
                message: `Are you sure you want to update data?`,
                color: 'primary',
              },
              enterAnimationDuration: '1200ms',
              exitAnimationDuration: '1200ms',
            }
          );

          confirmationDialog?.afterClosed().subscribe((confirmed?: boolean) => {
            if (confirmed) {
              const loadingDialog = this.dialog?.open(LoadingComponent, {
                width: 'auto',
                disableClose: true,
              });
              this.sourcesService.updateSourceActivate(result).subscribe({
                next: () => {
                  this.router?.navigate(['/sources']);
                  loadingDialog?.close();
                  this.message = 'Source has been successfully updated.';
                  this.messageType = 'success';
                },
                error: (error) => {
                  loadingDialog?.close();
                  this.message = error.error.message;
                  this.messageType = 'danger';
                },
              });
            } else {
              window.location.reload();
            }
          });
        }
      });

    this.message = undefined;
    this.messageType = undefined;
  }
}
