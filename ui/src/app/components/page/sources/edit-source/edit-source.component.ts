import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SourceInterface } from 'src/app/resources/interfaces';

@Component({
  selector: 'app-edit-source',
  templateUrl: './edit-source.component.html',
  styleUrls: ['./edit-source.component.css']
})
export class EditSourceComponent implements OnInit {

  id: number | undefined;
  type: string | undefined;
  username: string | undefined;
  password: string | undefined;
  url: string | undefined;


  constructor(
    public dialogRef: MatDialogRef<EditSourceComponent>,
    @Inject(MAT_DIALOG_DATA) public sourceToEdit: SourceInterface,
  ) 
  {
    
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveInstance(source: SourceInterface): void {
    let editedSource = {
      type: source.type,
      username: source.username,
      password: source.password,
      url: source.url
    }
    console.log("On Save ", editedSource);
  }
}

