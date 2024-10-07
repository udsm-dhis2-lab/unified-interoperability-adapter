import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';

interface BasicInfo {
  [key: string]: string;
}

interface ExtraInfoSection {
  sectionTitle: string;
  info: { [key: string]: string };
}

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  basicInfo: BasicInfo = {
    'Case ID': 'IBS_00297209',
    'FUll name': 'Herman Moshi Moshi',
    Sex: 'Male',
    'Date of Birth': '25/06/1989',
    Age: '35 Years',
  };

  extraInfo: ExtraInfoSection[] = [
    {
      sectionTitle: 'Contact Information',
      info: {
        'Phone Number': '+255-456-7890',
        Email: 'john.doe@example.com',
        'Permanet address': 'Dar es salaam, Tanzania',
        'Current address': 'Morogoro, Tanzania',
        Occupation: 'Software Engineer',
        Nationality: 'Tanzanian',
      },
    },
    {
      sectionTitle: 'Next of Kin',
      info: {
        'Full name': 'Herman Moshi Moshi',
        Relationship: 'Brother',
        'Phone number': '+255-456-7890',
      },
    },
    {
      sectionTitle: 'Insurance Type',
      info: {
        'Insuarance Provider': 'NSSF',
        'Insuarance Number': 'IBS_00297209',
        'Policy Number': 'IBS_00297209',
        'Group Number': 'IBS_00297209',
        Region: 'Tanzania',
      },
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
