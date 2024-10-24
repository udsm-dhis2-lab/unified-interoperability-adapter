import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';

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
export class ClientDetailsComponent implements OnInit {
  basicInfo: BasicInfo = {};

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

  constructor(private router: Router, private route: ActivatedRoute) {}
  backToList() {
    this.router.navigate(['']);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['client']) {
        const client = JSON.parse(params['client']);
        console.log('CLIENT', client);
        this.basicInfo = {
          'Case ID': client['demographicDetails']['caseID'],
          'Full name':
            (client['demographicDetails']['fname'] ?? '') +
            ' ' +
            (client['demographicDetails']['mname'] ?? '') +
            ' ' +
            (client['demographicDetails']['surname'] ?? ''),
          Sex: client['demographicDetails']['gender'],
          'Date of Birth': client['demographicDetails']['dateOfBirth'],
          Age:
            this.calculateAge(client['demographicDetails']['dateOfBirth']) +
            ' years',
        };
      }
    });
  }

  calculateAge(dateOfBirth: string): string {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  }
}
