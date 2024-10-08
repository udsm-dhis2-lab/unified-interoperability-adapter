import { Component } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

interface BasicInfo {
  [key: string]: string;
}

interface Deduplication {
  clientID: string;
  iDNumber: string;
  fullName: string;
}

interface ExtraInfoSection {
  sectionTitle: string;
  info: { [key: string]: string };
}

@Component({
  selector: 'app-deduplication-details',
  standalone: true,
  imports: [SharedModule],
  animations: [],
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

  constructor(private router: Router, private modal: NzModalService) {}
  backToList() {
    this.router.navigate(['']);
  }

  warning(): void {
    this.modal.warning({
      nzTitle: 'Warning',
      nzContent:
        'Are you sure you want to proceed merging this clients details',
      nzCancelText: 'Cancel',
      nzOkText: 'Yes',
    });
  }

  success(): void {
    this.modal.success({
      nzTitle: 'Request for merge has been sent successfully',
      nzContent: 'you will be notified once its done',
      nzOkText: 'Done',
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
