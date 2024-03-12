// import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { Router } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { InstanceInterface } from 'src/app/resources/interfaces';
// import { InstancesService } from 'src/app/services/instances/instances.service';
// import { UiService } from 'src/app/services/ui.service';
// import { SharedConfirmationModalComponent } from 'src/app/shared/modals/shared-confirmation-modal/shared-confirmation-modal.component';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { LoadingComponent } from 'src/app/shared/loader/loading/loading.component';

// @Component({
//   selector: 'app-manage-instance-modal',
//   templateUrl: './manage-instance-modal.component.html',
//   styleUrls: ['./manage-instance-modal.component.css']
// })
// export class ManageInstanceModalComponent implements OnInit {

//   instances: InstanceInterface[] | undefined;
//   instance: InstanceInterface | undefined;
//   showAddInstanceForm: boolean = false;
//   subscription: Subscription | undefined;
//   name: string | undefined;
//   message: string | undefined;
//   messageType: string | undefined;

 

//   constructor(
//     private _snackBar: MatSnackBar,
//     private instancesService: InstancesService,
//     private uiService?: UiService,
//     private router?: Router,
//     public dialog?: MatDialog,
//     public dialogRef?: MatDialogRef<ManageInstanceModalComponent>
//   ) {
//     this.subscription = this.uiService?.onToggleAddInstanceForm().subscribe({
//       next: (value) => (this.showAddInstanceForm = value),
//       error: (e) => console.log(e.message),
//     });
//   }


//   ngOnInit(): void {
//   }



//   onToggle() {
//     this.uiService?.toggleAddForm();
//   }

// // addInstance(instance: InstanceInterface): void {
// //   this.dialog
// //       ?.open(SharedConfirmationModalComponent, {
// //           minWidth: '30%',
// //           data: {
// //               title: 'Confirmation',
// //               message: `Are you sure you want to save data?`,
// //               color: 'primary',
// //           },
// //           enterAnimationDuration: '1200ms',
// //           exitAnimationDuration: '1200ms',
// //       }).afterClosed()
// //       .subscribe((confirmed?: boolean) => {
// //           if (confirmed) {
// //               this.instancesService.addInstance(instance).subscribe({
// //                   next: (addedInstance) => {
// //                       this.instances = [...this.instances!, addedInstance];
// //                       this.dialogRef?.close(true); // Close the dialog
// //                   },
// //                   error: () => {
// //                       // Optionally handle error
// //                   },
// //               });
// //           }
// //       });
// // }


// // addInstance(instance: InstanceInterface): void {
// //   const dialogRef = this.dialog?.open(SharedConfirmationModalComponent, {
// //           minWidth: '30%',
// //           data: {
// //               title: 'Confirmation',
// //               message: `Are you sure you want to save data?`,
// //               color: 'primary',
// //           },
// //           enterAnimationDuration: '1200ms',
// //           exitAnimationDuration: '1200ms',
// //       }).afterClosed()
// //       .subscribe((confirmed?: boolean) => {
// //           if (confirmed) {
// //               this.instancesService.addInstance(instance).subscribe({
// //                   next: (addedInstance) => {
// //                       this.instances = [...this.instances!, addedInstance];
// //                       this.dialogRef?.close(true); 
// //                   },
// //                   error: () => {
// //                       // Optionally handle error
// //                   },
// //               });
// //           }
// //       });
// // }
// addInstance(instance: InstanceInterface): void {
//   const dialogRef = this.dialog?.open(SharedConfirmationModalComponent, {
//     minWidth: '30%',
//     data: {
//       title: 'Confirmation',
//       message: 'Are you sure you want to save data?',
//       color: 'primary',
//     },
//     enterAnimationDuration: '1200ms',
//     exitAnimationDuration: '1200ms',
//   });
//   dialogRef?.afterClosed().subscribe((confirmed?: boolean) => {
//     if (confirmed) {
//       const loadingDialog = this.dialog?.open(LoadingComponent, {
//         width: 'auto',
//         disableClose: true,
//       });  
//       this.instancesService.addInstance(instance).subscribe({
//         next: (newInstance) => {
//           // console.log('olddd',this.instances);
//           this.instances = [...this.instances, newInstance]; 
//           // console.log('newwwww',newInstance);
//           loadingDialog?.close();
//           this.dialogRef?.close(true);
//         },
//         error: (error) => {
//           loadingDialog?.close();
//         },
//       });
//     }
//   });
// }



// }


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
  // instances: InstanceInterface[] | undefined;
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
            // console.log('olddd',this.instances);
            this.instances = [...this.instances, newInstance]; 
            // console.log('newwwww',newInstance);
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