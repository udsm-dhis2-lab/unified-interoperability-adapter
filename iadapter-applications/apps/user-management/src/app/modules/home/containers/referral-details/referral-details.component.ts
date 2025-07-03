import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ClientManagementService } from '../../services/client-management.service';
import { DynamicListComponent } from '../dynamic-list/dynamic-list.component';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    SharedModule,
    NzTabsModule,
    NzCollapseModule,
    DynamicListComponent,
    NzEmptyModule,
  ],
  providers: [ClientManagementService],
  templateUrl: './referral-details.component.html',
  styleUrl: './referral-details.component.css',
})
export class ClientDetailsComponent implements OnInit {
  loading: boolean = false;

  parentRoute?: string;

  expanded = false;

  client?: any;

  basicInfo: any;

  extraInfo: any;
  identifiers: any;

  clientID!: any;
  referrals: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService
  ) {}
  backToList() {
    this.router.navigate([this.parentRoute]);
  }

  objectKeys(obj: any): string[] {
    return Object?.keys(obj) || [];
  }

  drop(event: any) {
    console.log(event);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.loading = true;
      if (params) {
        const clientID = JSON.parse(params['client']);

        this.clientID = clientID;

        this.parentRoute = params['parentRoute'];

        this.clientManagementService
          .getClientById(clientID)
          .subscribe((client: any) => {
            this.client = client.listOfClients[0];

            this.extraInfo = [
              {
                sectionTitle: 'Referral',
                info: [],
              },
            ];

            this.basicInfo = {
              'Full Name': `${this.client?.demographicDetails?.fname || ''} ${
                this.client?.demographicDetails?.surname || ''
              }`.trim(),
              'Client ID': this.client?.demographicDetails?.clientID,
              Gender: this.client?.demographicDetails?.gender,
              'Date of Birth': this.client?.demographicDetails?.dateOfBirth,
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
              NIDA: this.client?.demographicDetails.nida || '-',
              Emails: this.client?.demographicDetails?.emails,
              Occupation: this.client?.demographicDetails?.occupation,
              Nationality: this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
              Address:
                this.client?.demographicDetails?.addresses?.map(
                  (address: any) => {
                    const addressParts = [
                      address?.village,
                      address?.ward,
                      address?.district,
                      address?.region,
                      address?.city,
                      address?.state,
                      address?.country,
                    ].filter(
                      (part) =>
                        part &&
                        part.trim() !== '' &&
                        part.trim() !== 'undefined'
                    ); // Filter out null, undefined, and empty strings

                    return addressParts.length > 0
                      ? addressParts.join(', ')
                      : '-';
                  }
                ) || '-',
            };

            this.identifiers =
              this.client?.demographicDetails?.identifiers?.map((id: any) => {
                return {
                  Type: id.type,
                  Number: id.id,
                };
              });

            this.loading = false;
          });
      }
    });

    this.loadHduClientsFromServer();
  }

  loadHduClientsFromServer() {
    this.loading = true;

    return this.clientManagementService
      .getReferrals({
        clientId: this.clientID,
        code: 'FHIR-REFERRAL-QUERY',
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'data');
          // this.loading = false;
          this.referrals = data;
        },
        error: (error) => {
          this.loading = false;
          //TODO: Implement error handling
        },
      });
  }
}
