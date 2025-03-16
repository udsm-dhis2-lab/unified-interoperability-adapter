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
            this.extraInfo = [
              {
                sectionTitle: 'Facility',
                info: this?.client?.facilityDetails || null,
              },
              {
                sectionTitle: 'Visit',
                info: this?.client?.visitDetails || null,
              },
              {
                sectionTitle: 'Clinical',
                info: this?.client?.clinicalInformation || null,
              },
              {
                sectionTitle: 'Allergies',
                info: this?.client?.allergies || null,
              },
              {
                sectionTitle: 'Chronic Conditions',
                info: this?.client?.chronicConditions || null,
              },
              {
                sectionTitle: 'Lifestyle',
                info: this?.client?.lifeStyleInformation || null,
              },
              {
                sectionTitle: 'Investigations',
                info: this?.client?.investigationDetails || null,
              },
              {
                sectionTitle: 'Lab Investigations',
                info: this?.client?.labInvestigationDetails || null,
              },
              {
                sectionTitle: 'Diagnosis',
                info: this?.client?.diagnosisDetails || null,
              },
              {
                sectionTitle: 'Medications',
                info: this?.client?.medicationDetails || null,
              },
              {
                sectionTitle: 'Treatment',
                info: this?.client?.treatmentDetails || null,
              },
              {
                sectionTitle: 'Radiology',
                info: this?.client?.radiologyDetails || null,
              },
              {
                sectionTitle: 'Admission',
                info: this?.client?.admissionDetails || null,
              },
              {
                sectionTitle: 'Outcome',
                info: this?.client?.outcomeDetails || null,
              },
              {
                sectionTitle: 'Causes of Death',
                info: this?.client?.causesOfDeathDetails || null,
              },
              {
                sectionTitle: 'Antenatal Care',
                info: this?.client?.antenatalCareDetails || null,
              },
              {
                sectionTitle: 'Vaccination',
                info: this?.client?.vaccinationDetails || null,
              },
              {
                sectionTitle: 'Family Planning',
                info: this?.client?.familyPlanningDetails || null,
              },
              {
                sectionTitle: 'Labor & Delivery',
                info: this?.client?.laborAndDeliveryDetails || null,
              },
              {
                sectionTitle: 'Postnatal',
                info: this?.client?.postnatalDetails || null,
              },
              {
                sectionTitle: 'Billing',
                info: this?.client?.billingsDetails || null,
              },
              {
                sectionTitle: 'Payment',
                info: this?.client?.visitMainPaymentDetails || null,
              },
              {
                sectionTitle: 'Referral',
                info: this?.client?.referralDetails || null,
              },
              {
                sectionTitle: 'Other Information',
                info: this?.client?.otherInformation || null,
              },
              {
                sectionTitle: 'Reporting',
                info: this?.client?.reportingDetails || null,
              },
            ].filter(
              (section) =>
                section.info !== null &&
                section.info !== undefined &&
                (typeof section.info !== 'object' ||
                  Object.keys(section.info).length > 0)
            );


            this.basicInfo = {
              'Full Name': `${this.client?.demographicDetails?.fname || ''} ${this.client?.demographicDetails?.surname || ''}`.trim(),
              'Client ID': this.client?.demographicDetails?.clientID,
              'Gender': this.client?.demographicDetails?.gender,
              'Date of Birth': this.client?.demographicDetails?.dateOfBirth,
              'ID Number': this.client?.demographicDetails?.idNumber,
              'ID Type': this.client?.demographicDetails?.idType,
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
              'Emails': this.client?.demographicDetails?.emails,
              // 'Addresses': this.client?.demographicDetails?.addresses,
              'Occupation': this.client?.demographicDetails?.occupation,
              'Nationality': this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
            };

            this.loading = false;

            console.log(this.client);
          });
      }
    });
  }
}
