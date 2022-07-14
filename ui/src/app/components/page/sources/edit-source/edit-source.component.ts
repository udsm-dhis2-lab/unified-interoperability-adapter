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
  name: string | undefined;
  username: string | undefined;
  password: string | undefined;
  url: string | undefined;
  port: number | undefined;
  active: string | undefined;


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
    let editedInstance = {
      id: source.id,
      name: source.name,
      username: source.username,
      password: source.password,
      url: source.url,
      port: source.port,
      active: source.active,
    }
    console.log("On Save ", editedInstance);
  }
}

