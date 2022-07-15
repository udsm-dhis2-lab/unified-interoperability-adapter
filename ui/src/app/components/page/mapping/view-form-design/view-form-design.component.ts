import { MappingComponent } from './../mapping.component';
import { AddQueryComponent } from './custom-form/add-query/add-query.component';
import { Component, Input, OnInit } from '@angular/core';
import { DatasetInterface, SourceInterface } from 'src/app/resources/interfaces';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-form-design',
  templateUrl: './view-form-design.component.html',
  styleUrls: ['./view-form-design.component.css']
})
export class ViewFormDesignComponent implements OnInit {

  source: SourceInterface | undefined;
  query: string | undefined;
  viewFormDesignComponent: boolean = false;
  
  @Input() sources: SourceInterface[] | undefined;

  @Input() dataset: DatasetInterface | undefined;


  constructor(
    public dialog?: MatDialog,
    private router?: Router,
    private mappingComponent?: MappingComponent
  ) 
  { }

  ngOnInit(): void {
    if(!this.dataset){
      this.mappingComponent?.filterDatasets();
    }
  }


  viewFormDesign(dataset: DatasetInterface){
     console.log(dataset)
  }

  changesOnDataValue(e: Event){
    console.log(e)
  }

}
