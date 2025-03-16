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

  extraInfo: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService
  ) {}
  backToList() {
    this.router.navigate([this.parentRoute]);
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
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

            console.log(this.client);

            this.basicInfo = {
              'Full Name': `${this.client?.demographicDetails?.fname || ''} ${
                this.client?.demographicDetails?.surname || ''
              }`.trim(),
              'Client ID': this.client?.demographicDetails?.clientID,
              Gender: this.client?.demographicDetails?.gender,
              'Date of Birth': this.client?.demographicDetails?.dateOfBirth,
              'ID Number': this.client?.demographicDetails?.idNumber,
              'ID Type': this.client?.demographicDetails?.idType,
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
              Emails: this.client?.demographicDetails?.emails,
              // 'Addresses': this.client?.demographicDetails?.addresses,
              Occupation: this.client?.demographicDetails?.occupation,
              Nationality: this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
            };

            this.loading = false;

            console.log(this.client);
          });
      }
    });
  }
}
