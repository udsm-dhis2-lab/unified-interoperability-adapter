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
  templateUrl: './health-r-details.component.html',
  styleUrl: './health-r-details.component.css',
})
export class HealthRecordsDetailsComponent implements OnInit {
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
    return Object.keys(obj);
  }

  drop(event: any) {
    console.log(event);
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

            this.extraInfo = [
              {
                sectionTitle: 'Facility',
                info: {
                  Name: this.client?.facilityDetails?.name,
                  Code: this.client?.facilityDetails?.code,
                },
              },
              {
                sectionTitle: 'Visit',
                info: {
                  ID: this.client?.visitDetails?.id,
                  'Visit Date': this.client?.visitDetails?.visitDate,
                  'Closed Date': this.client?.visitDetails?.closedDate,
                  'Visit Type': this.client?.visitDetails?.visitType,
                  'New This Year': this.client?.visitDetails?.newThisYear,
                  New: this.client?.visitDetails?.isNew,
                  'Care Services': this.client?.visitDetails?.careServices,
                  'Attended Specialist':
                    this.client?.visitDetails?.attendedSpecialist
                      .filter(
                        (specialist: any) =>
                          specialist.superSpecialist !== null ||
                          specialist.specialist !== null
                      )
                      .map((specalist: any) => {
                        return {
                          Name: specalist.name,
                          Specialty: specalist.specialty,
                        };
                      }),
                },
              },
              {
                sectionTitle: 'Clinical Information',
                info: {
                  'Vital Signs':
                    this.client?.clinicalInformation?.vitalSigns
                      ?.filter((vitalSign: any) =>
                        Object.values(vitalSign).some((value) => value !== null)
                      )
                      .map((vitalSign: any) => ({
                        'Blood Pressure': vitalSign.bloodPressure || '-',
                        Weight: vitalSign.weight || '-',
                        Temperature: vitalSign.temperature || '-',
                        Height: vitalSign.height || '-',
                        Respiration: vitalSign.respiration || '-',
                        'Pulse Rate': vitalSign.pulseRate || '-',
                        'Recorded At': vitalSign.dateTime || '-',
                      })) || 'No vital signs recorded',
                  'Visit Notes': this.client?.clinicalInformation?.visitNotes
                    ?.length
                    ? this.client?.clinicalInformation?.visitNotes.reduce(
                        (acc: any, note: any) => {
                          const visitDate = note.date || 'Unknown Date';
                          acc[visitDate] = acc[visitDate] || [];
                          return {
                            'Visit Date': note.date || 'Unknown Date',
                            'Provider Specialty':
                              note.providerSpeciality || '-',
                            'Chief Complaints': note.chiefComplaints?.length
                              ? note.chiefComplaints
                              : 'None',
                            'History of Present Illness': note
                              .historyOfPresentIllness?.length
                              ? note.historyOfPresentIllness
                              : 'None',
                            'Review of Other Systems': note.reviewOfOtherSystems
                              ?.length
                              ? note.reviewOfOtherSystems
                              : 'None',
                            'Past Medical History': note.pastMedicalHistory
                              ?.length
                              ? note.pastMedicalHistory
                              : 'None',
                            'Family and Social History': note
                              .familyAndSocialHistory?.length
                              ? note.familyAndSocialHistory
                              : 'None',
                            'General Examination': note
                              .generalExaminationObservation?.length
                              ? note.generalExaminationObservation
                              : 'None',
                            'Local Examination': note.localExamination?.length
                              ? note.localExamination
                              : 'None',
                            'Systemic Examination': note
                              .systemicExaminationObservation?.length
                              ? note.systemicExaminationObservation
                              : 'None',
                            'Doctor’s Plan/Suggestion': note
                              .doctorPlanOrSuggestion?.length
                              ? note.doctorPlanOrSuggestion
                              : 'None',
                          };
                        },
                        {}
                      )
                    : 'No visit notes available',
                },
              },
              {
                sectionTitle: 'Lifestyle Information',
                info: {
                  Smoking: this.client?.lifeStyleInformation?.smoking?.use
                    ? 'Yes'
                    : 'No',
                  'Alcohol Use': this.client?.lifeStyleInformation?.alcoholUse
                    ?.use
                    ? 'Yes'
                    : 'No',
                  'Drug Use': this.client?.lifeStyleInformation?.drugUse?.use
                    ? 'Yes'
                    : 'No',
                },
              },
              {
                sectionTitle: 'Outcome Details',
                info: {
                  'Is Alive': this.client?.outcomeDetails?.isAlive
                    ? 'Yes'
                    : 'No',
                  'Death Location':
                    this.client?.outcomeDetails?.deathLocation || '-',
                  'Death Date': this.client?.outcomeDetails?.deathDate || '-',
                  Referred: this.client?.outcomeDetails?.referred
                    ? 'Yes'
                    : 'No',
                },
              },
              {
                sectionTitle: 'Contact People',
                info: {
                  'Contact People': this.client?.demographicDetails?.contactPeople?.filter(
                    (contact: any) => contact.relationShip !== null
                  ).map(
                    (contact: any) => ({
                      'First Name': contact.firstName || '-',
                      'Last Name': contact.lastName || '-',
                      'Phone Numbers':
                        contact.phoneNumbers
                          ?.filter((num: any) => num)
                          ?.join(', ') || 'No contact number',
                      Relationship: contact.relationShip || '-',
                    })
                  )[0] || 'No emergency contacts available',
                }
                  // [this.client?.demographicDetails?.contactPeople?.filter(
                  //   (contact: any) => contact.relationShip !== null
                  // ).map(
                  //   (contact: any) => ({
                  //     'First Name': contact.firstName || '-',
                  //     'Last Name': contact.lastName || '-',
                  //     'Phone Numbers':
                  //       contact.phoneNumbers
                  //         ?.filter((num: any) => num)
                  //         ?.join(', ') || 'No contact number',
                  //     Relationship: contact.relationShip || '-',
                  //   })
                  // )[0] || 'No emergency contacts available',]
              },
            ].filter(
              (section) =>
                section.info !== null &&
                section.info !== undefined &&
                (typeof section.info !== 'object' ||
                  Object.keys(section.info).length > 0)
            );

            this.basicInfo = {
              'Full Name': `${this.client?.demographicDetails?.fname || ''} ${
                this.client?.demographicDetails?.surname || ''
              }`.trim(),
              'Client ID': this.client?.demographicDetails?.clientID,
              Gender: this.client?.demographicDetails?.gender,
              'Date of Birth': this.client?.demographicDetails?.dateOfBirth,
              "NIDA": this.client?.demographicDetails.nida || '-',
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
              Emails: this.client?.demographicDetails?.emails,
              Occupation: this.client?.demographicDetails?.occupation,
              Nationality: this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
              Address: JSON.parse(this.client?.demographicDetails?.addresses).map((address: any)=> {
                return `${address?.village || ''} ${address?.ward  || ''} ${address?.district || ''} ${address?.region || ''} ${address?.city || ''} ${address.state || ''} ${address.country}`
              }) || '-',
            };

            console.log(JSON.parse(this.client?.demographicDetails?.addresses))

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
  }
}
