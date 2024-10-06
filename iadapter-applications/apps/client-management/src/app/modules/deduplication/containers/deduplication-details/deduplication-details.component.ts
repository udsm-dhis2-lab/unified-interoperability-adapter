import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';

interface BasicInfo {
  [key: string]: string;
}

interface Deduplication {
  clientID: string;
  iDNumber: string;
  fullName: string;
}

@Component({
  selector: 'app-deduplication-details',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './deduplication-details.component.html',
  styleUrl: './deduplication-details.component.css',
})
export class DeduplicationDetailsComponent {
  basicInfo: BasicInfo = {
    'Case ID': 'IBS_00297209',
    'FUll name': 'Herman Moshi Moshi',
    Sex: 'Male',
    'Date of Birth': '25/06/1989',
    Age: '35 Years',
  };

  listOfData: Deduplication[] = [
    {
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
    },
    {
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
    },
    {
      clientID: 'IBS_00297209',
      iDNumber: '97782H',
      fullName: 'Herman Moshi Moshi',
    },
  ];

  constructor(private router: Router) {}
  backToList() {
    this.router.navigate(['']);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
