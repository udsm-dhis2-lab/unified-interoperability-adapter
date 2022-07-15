import { InstanceInterface } from 'src/app/resources/interfaces';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-instance',
  templateUrl: './edit-instance.component.html',
  styleUrls: ['./edit-instance.component.css']
})

export class EditInstanceComponent {

  id: number | undefined;
  name: string | undefined;
  username: string | undefined;
  password: string | undefined;
  url: string | undefined;
  port: number | undefined;
  active: string | undefined;

  

  constructor(
    public dialogRef: MatDialogRef<EditInstanceComponent>,
    @Inject(MAT_DIALOG_DATA) public instanceToEdit: InstanceInterface,
  ) 
  {
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveInstance(instance: InstanceInterface): void {
    let editedInstance = {
      name: instance.name,
      username: instance.username,
      password: instance.password,
      url: instance.url
    }
    console.log("On Save ", editedInstance);
  }
}