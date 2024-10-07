import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';

interface ItemData {
  sn: number;
  clientID: string;
  fname: string;
  mname: string;
  surname: string;
  gender: string;
  idNUmber: string;
  idType: string;
  associatedDuplicates: number;
}

@Component({
  selector: 'app-deduplication-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './deduplication-home.component.html',
  styleUrl: './deduplication-home.component.css',
})
export class DeduplicationHomeComponent {
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];

  constructor(private router: Router) {}

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
  }

  ngOnInit(): void {
    this.listOfData = new Array(200).fill(0).map((_, index) => ({
      sn: index + 1,
      clientID: `CL_${index}78989`,
      fname: `Edward ${index}`,
      mname: `Justin ${index}`,
      surname: `Bezos ${index}`,
      gender: 'Male',
      idNUmber: `${index}7898-75383238378946${index}`,
      idType: 'NIDA',
      associatedDuplicates: 2 + index,
    }));
  }

  onView() {
    this.router.navigate(['/deduplication/deduplication-details']);
  }
}
