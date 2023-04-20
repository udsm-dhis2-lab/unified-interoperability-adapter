import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-playground-modal',
  templateUrl: './playground-modal.component.html',
  styleUrls: ['./playground-modal.component.css'],
})
export class PlaygroundModalComponent implements OnInit {
  testQuery: string | undefined;
  constructor(private dialogRef: MatDialogRef<PlaygroundModalComponent>) {}

  ngOnInit(): void {}

  onCancel(event: Event): void {
    event.stopPropagation();
    this.dialogRef.close();
  }

  onTest(event: Event): void {
    event.stopPropagation();
  }
}
