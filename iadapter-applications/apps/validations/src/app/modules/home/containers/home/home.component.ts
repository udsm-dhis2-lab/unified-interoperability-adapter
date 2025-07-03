import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'apps/validations/src/app/shared/shared.module';

// Import necessary Ng-Zorro modules
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
// Change: NzResizableModule and NzResizeEvent have been removed as they are no longer used.

export interface ValidationRule {
  ruleExpression: string;
  message: string;
  name: string;
  description:string;
  code: string;
}

@Component({
  standalone: true,
  selector: 'home-component',
  imports: [
    SharedModule, RouterModule, FormsModule, NzLayoutModule, NzBreadCrumbModule,
    NzGridModule, NzButtonModule, NzTableModule, NzInputModule, NzIconModule
    // Change: NzResizableModule removed from imports
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  listOfData: ValidationRule[] = [];

  columnWidths = {
    name: '10%',
    description: '25%',
    message: '25%',
    code: '10%',
    expression: '20%', // This now takes 20% of the available table width
    action: '5%'
  };

  ngOnInit(): void {
    this.listOfData = [
      {
        "ruleExpression": "(#{postnatalDetails.hivDetails.status} == T(com.Adapter.icare.Enums.STATUS).NEGATIVE && #{postnatalDetails.birthDetails.?[motherHivStatus == false].size()} == #{postnatalDetails.birthDetails.size()}) || (#{postnatalDetails.hivDetails.status} == T(com.Adapter.icare.Enums.STATUS).POSITIVE && #{postnatalDetails.birthDetails.?[motherHivStatus == true].size()} == #{postnatalDetails.birthDetails.size()}) || (#{postnatalDetails.hivDetails.status} == null && #{postnatalDetails.birthDetails.?[motherHivStatus == null].size()} == #{postnatalDetails.birthDetails.size()})",
        "message": "postnatalDetails.hivDetails.status must be equal to postnatalDetails.birthDetails.motherHivStatus",
        "name": "VALIDATE HIV STATUS",
        "description": "Validate Mother HIV Status should be equal to mother HIV status in child details",
        "code": "postnatal"
      }
    ];
  }

  addNewValidation(): void {
    console.log('Add New Validation button clicked!');

   this.router.navigate(['/validations/validations/new']);
  }

  // Change: The onColumnResize method has been completely removed.
}
