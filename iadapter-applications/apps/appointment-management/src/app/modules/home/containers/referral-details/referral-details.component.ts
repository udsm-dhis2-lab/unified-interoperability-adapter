import { map, filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { calculateAge } from 'apps/client-management/src/app/shared/helpers/helpers';
import { HduHttpService } from 'libs/hdu-api-http-client/src/lib/services/hdu-http.service';
import { ClientManagementService } from '../../services/client-management.service';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DynamicListComponent } from '../dynamic-list/dynamic-list.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    SharedModule,
    NzTabsModule,
    NzCollapseModule,
    DynamicListComponent,
    NzEmptyModule,
    NzDividerModule,
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService
  ) {}
  backToList() {
    this.router.navigate([this.parentRoute]);
  }

  objectKeys(obj: any): string[] {
    return Object?.keys(obj || {}) || [];
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
            this.extraInfo = [
              {
                sectionTitle: 'Appointment',
                info: this.client?.demographicDetails?.appointment.map(
                  (appointment: any) => {
                    return {
                      'Appointment ID': appointment?.appointmentId,
                      'HFR Code': appointment?.hfrCode,
                      Status: appointment?.appointmentStatus,
                      'Payment Details': appointment?.paymentDetails?.map(
                        (payment: any) => {
                          return {
                            'Payment Control Number': payment?.controlNumber,
                            'Payment Status':
                              payment?.statusCode === '200'
                                ? 'Successful'
                                : 'Failed',
                            Description: payment?.description,
                          };
                        }
                      ),
                      'Service Details': appointment.serviceDetails?.map(
                        (service: any) => {
                          console.log(service);
                          return {
                            'Service Code':
                            service?.serviceCode,
                            'Service Name':
                            service?.serviceName,
                            'Service Short Name':
                            service?.shortName,
                          };
                        }
                      ),
                    };
                  }
                ),
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
              Emails: this.client?.demographicDetails?.emails,
              Occupation: this.client?.demographicDetails?.occupation,
              Nationality: this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
            };

            this.identifiers =
              this.client?.demographicDetails?.identifiers?.map((id: any) => {
                return {
                  Type: id.type,
                  Number: id.id,
                };
              });

            this.loading = false;

            console.log(this.client);
          });
      }
    });
  }
}
