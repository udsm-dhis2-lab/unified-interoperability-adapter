import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceInterface } from 'src/app/resources/interfaces';
import { SourcesService } from 'src/app/services/sources/sources.service';
import { faAdd, faEdit, faSubtract, faThumbsDown, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-query',
  templateUrl: './add-query.component.html',
  styleUrls: ['./add-query.component.css']
})
export class AddQueryComponent implements OnInit {

  source: SourceInterface | undefined;
  query: string | undefined;
  showTestResults: boolean = false;
  message: string | undefined;
  messageType: string | undefined;



  faTimes= faTimes;

  constructor(
    public dialogRef: MatDialogRef<AddQueryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueryData,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveInstance(sourceSelected: SourceInterface): void {
    console.log("On Save ", sourceSelected);
  }

  clearForm(){
    
  }

  onTest(){
    this.showTestResults = true;
  }

}

export interface QueryData {
  sources: SourceInterface[];
  source: SourceInterface;
  query: string;
}
