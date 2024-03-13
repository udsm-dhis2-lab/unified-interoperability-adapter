import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-shared-confirmation-modal',
  templateUrl: './shared-confirmation-modal.component.html',
  styleUrls: ['./shared-confirmation-modal.component.css']
})
export class SharedConfirmationModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<SharedConfirmationModalComponent>) { }
        
  ngOnInit(): void {

  }

  onConfirm(event: MouseEvent): void {
    event.stopPropagation();
    this.dialogRef.close(true);
    }

}
