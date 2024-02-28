import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SourceInterface } from 'src/app/models/source.model';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { UiService } from 'src/app/services/ui.service';
import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';

@Component({
  selector: 'app-manage-sources-modal',
  templateUrl: './manage-sources-modal.component.html',
  styleUrls: ['./manage-sources-modal.component.css']
})
export class ManageSourcesModalComponent implements OnInit {

  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;
  showAddSourceForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;
  messageType: string | undefined;

  constructor(
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

  ngOnInit(): void {

  }


  onToggle() {
    this.uiService?.toggleAddForm();
  }

  // addSource(source: SourceInterface) {


  //   this.sourcesService.addSource(source).subscribe({
  //     next: () => {
  //       this.sources?.push(source);
  //       // this.router?.navigate(['./sources']);
  //       this.message = 'Source added successfully.';
  //       this.messageType = 'success';
  //     },
  //     error: (error) => {
  //       this.message = error.error.message;
  //       this.messageType = 'danger';
  //     },
  //   });
  // }

  addSource(source: SourceInterface) {
    // Open the confirmation modal
    this.dialog?.open(SharedConfirmationModalComponent, {
      minWidth: '30%',
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to save data?`,
        color: 'primary'
      },
      enterAnimationDuration: '1200ms',
      exitAnimationDuration: '1200ms'
    }).afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        this.sourcesService.addSource(source).subscribe({
          next: () => {
            this.dialogRef?.close(true);
          },
          error: (error) => {
            this.message = error.error.message;
            this.messageType = 'danger';
          },
        });
      }
    });
  }
} 

  


