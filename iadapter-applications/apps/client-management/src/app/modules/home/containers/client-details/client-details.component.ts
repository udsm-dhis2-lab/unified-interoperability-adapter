import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { calculateAge } from 'apps/client-management/src/app/shared/helpers/helpers';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
// import { ClientManagementService } from '../../services/client-management.service';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ClientManagementService } from '../../services/client-management.service';
import { resourceLimits } from 'worker_threads';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [SharedModule, NzTabsModule, NzCollapseModule, NzEmptyModule],
  providers: [ClientManagementService],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent implements OnInit {
  loading: boolean = false;

  parentRoute?: string;

  expanded = false;

  client?: any;

  basicInfo: any;
  identifiers: any;
  appointmentDetails: any;

  extraInfo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService
  ) {}
  backToList() {
    this.router.navigate([this.parentRoute]);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.loading = true;
      console.log(JSON.parse(params['client']));
      if (params) {
        const clientID = JSON.parse(params['client']);

        this.parentRoute = params['parentRoute'];

        this.clientManagementService
          .getClientById(clientID)
          .subscribe((client: any) => {
            this.client = client.listOfClients[0];

            console.log(client);
            const sampleClient = [
              {
                facilityDetails: {
                  code: null,
                  name: null,
                },
                demographicDetails: {
                  id: 'HCR-M-096748-09052021',
                  firstName: 'MUDI',
                  middleName: null,
                  lastName: 'TEST',
                  dateOfBirth: '2025-03-02',
                  gender: 'male',
                  phoneNumbers: ['0752043246'],
                  emails: [],
                  occupation: null,
                  maritalStatus: 'Single',
                  nationality: null,
                  addresses: [
                    {
                      village: 'Tenge',
                      ward: 'Tabata',
                      district: 'Ilala',
                      region: 'Dar es salaam',
                      country: 'Tanzania',
                      category: 'Temporary',
                    },
                  ],
                  identifiers: [
                    {
                      id: '689609',
                      type: 'MRN',
                      preferred: false,
                      system: 'HDU',
                      organization: null,
                    },
                    {
                      id: 'HCR-M-096748-09052021',
                      type: 'HCRCODE',
                      preferred: false,
                      system: 'HDU',
                      organization: null,
                    },
                    {
                      id: '102557-6-61580',
                      type: 'REFERRAL-NUMBER',
                      preferred: false,
                      system: null,
                      organization: null,
                    },
                    {
                      id: '102557-6-61583',
                      type: 'REFERRAL-NUMBER',
                      preferred: false,
                      system: null,
                      organization: null,
                    },
                    {
                      id: '111890-0-56430-096-2024',
                      type: 'REFERRAL-NUMBER',
                      preferred: false,
                      system: null,
                      organization: null,
                    },
                    {
                      id: 'F-2025-786181',
                      type: 'MRN',
                      preferred: false,
                      system: 'HDU',
                      organization: null,
                    },
                    {
                      id: '79519785631',
                      type: 'INSURANCE',
                      preferred: false,
                      system: 'HDU',
                      organization: null,
                    },
                    {
                      id: '19740509-187090-00003-21',
                      type: 'NIDA',
                      preferred: false,
                      system: 'HDU',
                      organization: null,
                    },
                    {
                      id: '102557-6-61585',
                      type: 'REFERRAL-NUMBER',
                      preferred: false,
                      system: null,
                      organization: null,
                    },
                  ],
                  contactPeople: [
                    {
                      firstName: 'ASHURA',
                      lastName: 'BAKARI',
                      phoneNumbers: ['0753524208'],
                      relationShip: null,
                    },
                  ],
                  paymentDetails: [
                    {
                      type: 'CASH',
                      shortName: 'CASH',
                      name: 'CASH',
                      status: null,
                      insuranceId: '4',
                      insuranceCode: null,
                      policyNumber: null,
                      groupNumber: null,
                    },
                    {
                      type: 'INSURANCE',
                      shortName: 'NHIF',
                      name: 'National Health Insurance Fund',
                      status: null,
                      insuranceId: '7383738389393',
                      insuranceCode: 'INS001',
                      policyNumber: null,
                      groupNumber: null,
                    },
                  ],
                  relatedClients: [],
                  appointmentDetails: [{
                    Date: '2021-05-09',
                    Location: 'Muhimbili National Hospital',
                    Provider: 'Dr. John Doe',
                    Status: 'Scheduled',
                    Time: '09:00',
                  }],
                },
              },
            ];

            this.basicInfo = this.formatApiResponse(sampleClient[0])[
              'Demographic Details'
            ];
            this.identifiers = this.formatApiResponse(sampleClient[0])[
              'Identifiers'
            ];

            this.appointmentDetails = this.formatApiResponse(sampleClient[0])[
              'Appointments'
            ];
            console.log(this.identifiers, 'identifiers');

            this.loading = false;
          });
      }
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Utility function to format keys and values
  formatApiResponse(result: any): { [key: string]: any } {
    if (!result) {
      return {};
    }

    const formattedResponse: { [key: string]: any } = {};

    return {
      // {`${id.type}: ${id.id}`}
      Identifiers: result.demographicDetails.identifiers?.map((id: any) => {
        return {
          Type: id.type,
          Number: id.id,
        };
      }),

      'Appointments': result?.demographicDetails?.appointmentDetails || '-',
      'Contact People':
        result.demographicDetails.contactPeople?.join(', ') || '-',
      'Payment Details':
        result.demographicDetails.paymentDetails?.join(', ') || '-',

      'Demographic Details': {
        'Full Name': `${result.demographicDetails.firstName || ''} ${
          result.demographicDetails.middleName || ''
        } ${result.demographicDetails.lastName || ''}`.trim(),
        'Client ID': result.demographicDetails.id,
        Gender: result.demographicDetails.gender,
        'Date of Birth': result.demographicDetails.dateOfBirth,
        'Marital Status': result.demographicDetails.maritalStatus || '-',
        'Phone Numbers':
          result.demographicDetails.phoneNumbers?.join(', ') || '-',
        Emails: result.demographicDetails.emails?.join(', ') || '-',
        Occupation: result.demographicDetails.occupation || '-',
        Nationality: result.demographicDetails.nationality || '-',
        'Related Clients':
          result.demographicDetails.relatedClients?.join(', ') || '-',
        Appointment: result.demographicDetails.appointment || '-',
      },

      'Facility Details': {
        'Facility Code': result.facilityDetails.code || '-',
        'Facility Name': result.facilityDetails.name || '-',
      },
    };

    return formattedResponse;
  }
}
