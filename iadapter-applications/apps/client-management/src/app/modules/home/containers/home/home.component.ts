import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';

interface ItemData {
  clientID: string;
  fname: string;
  mname: string;
  surname: string;
  gender: string;
  idNUmber: string;
  idType: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];

  constructor(private router: Router) {}

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
  }

  ngOnInit(): void {
    this.listOfData = new Array(200).fill(0).map((_, index) => ({
      clientID: `CL_${index}78989`,
      fname: `Edward ${index}`,
      mname: `Justin ${index}`,
      surname: `Bezos ${index}`,
      gender: 'Male',
      idNUmber: `${index}7898-75383238378946${index}`,
      idType: 'NIDA',
    }));
  }

  navigateToClientDetails() {
    this.router.navigate(['/client-management/client-details']);
  }
}
