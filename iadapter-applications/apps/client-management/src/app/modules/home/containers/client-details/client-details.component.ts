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
      if (params) {
        const clientID = JSON.parse(params['client']);

        this.parentRoute = params['parentRoute'];

        this.clientManagementService
          .getClientById(clientID)
          .subscribe((client: any) => {
            this.client = client.listOfClients[0];

            console.log(this.client, 'identifiers');

            this.basicInfo = this.formatApiResponse(this.client)[
              'Demographic Details'
            ];


            this.identifiers = this.client.demographicDetails.identifiers.map(
              (id: any) => {
                return {
                  Type: id.type,
                  Number: id.id
                };
              }
            );


            this.appointmentDetails = this.formatApiResponse(this.client)[
              'Appointments'
            ];

            this.loading = false;
          });
      }
    });
  }

  drop(event: any) {
    console.log(event);
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
        'Full Name': result.demographicDetails.fullName,
        'Client ID': result.demographicDetails.clientID,
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
