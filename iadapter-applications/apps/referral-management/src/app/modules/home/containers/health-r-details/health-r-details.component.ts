import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { ClientManagementService } from '../../services/client-management.service';
import { DicomViewerComponent } from '../dicom-viewer/dicom-viewer.component';
import { DynamicListComponent } from '../dynamic-list/dynamic-list.component';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [
    SharedModule,
    NzTabsModule,
    NzCollapseModule,
    DynamicListComponent,
    NzEmptyModule,
    NzTabsModule,
    NzCollapseModule,
    NzUploadModule,
    NzIconModule,
  ],
  providers: [ClientManagementService],
  templateUrl: './health-r-details.component.html',
  styleUrl: './health-r-details.component.css',
})
export class HealthRecordsDetailsComponent implements OnInit {
  loading: boolean = false;

  parentRoute?: string;

  expanded = false;

  visits: any[] = [];

  client?: any;

  basicInfo: any;

  extraInfo: any;
  identifiers: any;

  hcrCode!: string;

  files: { name: string; url: string }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientManagementService: ClientManagementService,
    private modal: NzModalService,
    private messageService: NzMessageService
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

        this.hcrCode = clientID;

        this.parentRoute = params['parentRoute'];

        this.clientManagementService
          .getClientById(clientID)
          .subscribe((client: any) => {
            this.client = client.listOfClients[0];
            this.files = this.client.demographicDetails?.files ?? [];

            this.visits = client.listOfClients.map((visit: any) => ({
              extraInfo: [
                {
                  sectionTitle: 'Facility',
                  info: {
                    Name: visit?.facilityDetails?.name || '-',
                    Code: visit?.facilityDetails?.code || '-',
                  },
                },
                {
                  sectionTitle: 'Clinical Information',
                  info: {
                    'Vital Signs': visit?.clinicalInformation?.vitalSigns
                      ?.length
                      ? visit.clinicalInformation.vitalSigns
                          .filter((vitalSign: any) =>
                            Object.values(vitalSign).some(
                              (value) => value !== null
                            )
                          )
                          .map((vitalSign: any) => ({
                            'Blood Pressure': vitalSign.bloodPressure || '-',
                            Weight: vitalSign.weight || '-',
                            Temperature: vitalSign.temperature || '-',
                            Height: vitalSign.height || '-',
                            Respiration: vitalSign.respiration || '-',
                            'Pulse Rate': vitalSign.pulseRate || '-',
                            'Recorded At': vitalSign.dateTime || '-',
                          }))
                      : 'No vital signs recorded',
                    'Visit Notes': visit?.clinicalInformation?.visitNotes
                      ?.length
                      ? visit.clinicalInformation.visitNotes.map(
                          (note: any) => ({
                            'Visit Date': note.date || 'Unknown Date',
                            'Provider Specialty':
                              note.providerSpeciality || '-',
                            'Chief Complaints': note.chiefComplaints?.length
                              ? note.chiefComplaints.join(', ')
                              : 'None',
                            'History of Present Illness': note
                              .historyOfPresentIllness?.length
                              ? note.historyOfPresentIllness.join(', ')
                              : 'None',
                            'Review of Other Systems': note.reviewOfOtherSystems
                              ?.length
                              ? note.reviewOfOtherSystems
                                  .map((ros: any) => ros.name)
                                  .join(', ')
                              : 'None',
                            'Past Medical History': note.pastMedicalHistory
                              ?.length
                              ? note.pastMedicalHistory.join(', ')
                              : 'None',
                            'Family and Social History': note
                              .familyAndSocialHistory?.length
                              ? note.familyAndSocialHistory.join(', ')
                              : 'None',
                            'General Examination': note
                              .generalExaminationObservation?.length
                              ? note.generalExaminationObservation.join(', ')
                              : 'None',
                            'Local Examination': note.localExamination?.length
                              ? note.localExamination.join(', ')
                              : 'None',
                            'Systemic Examination': note
                              .systemicExaminationObservation?.length
                              ? note.systemicExaminationObservation.join(', ')
                              : 'None',
                            'Doctor’s Plan/Suggestion': note
                              .doctorPlanOrSuggestion?.length
                              ? note.doctorPlanOrSuggestion.join(', ')
                              : 'None',
                          })
                        )
                      : 'No visit notes available',
                  },
                },
                {
                  sectionTitle: 'Allergies',
                  info: {
                    Allergies: visit?.allergies?.length
                      ? visit.allergies
                          .map((allergy: any) => allergy.name || allergy)
                          .join(', ')
                      : 'No allergies recorded',
                  },
                },
                {
                  sectionTitle: 'Chronic Conditions',
                  info: {
                    Conditions: visit?.chronicConditions?.length
                      ? visit.chronicConditions
                          .map((condition: any) =>
                            condition &&
                            typeof condition === 'object' &&
                            condition.name
                              ? condition.name
                              : ''
                          )
                          .join(', ')
                      : 'No chronic conditions recorded',
                  },
                },
                {
                  sectionTitle: 'Lifestyle Information',
                  info: {
                    Smoking: visit?.lifeStyleInformation?.smoking?.use
                      ? 'Yes'
                      : 'No',
                    'Alcohol Use': visit?.lifeStyleInformation?.alcoholUse?.use
                      ? 'Yes'
                      : 'No',
                    'Drug Use': visit?.lifeStyleInformation?.drugUse?.use
                      ? 'Yes'
                      : 'No',
                  },
                },
                {
                  sectionTitle: 'Investigation Details',
                  info: {
                    Investigations: visit?.investigationDetails?.length
                      ? visit.investigationDetails.map((inv: any) => ({
                          Name: inv.name || '-',
                          Date: inv.date || '-',
                          Result: inv.result || '-',
                        }))
                      : 'No investigation details available',
                  },
                },
                {
                  sectionTitle: 'Lab Investigation Details',
                  info: {
                    'Lab Results': visit?.labInvestigationDetails?.length
                      ? visit.labInvestigationDetails.map((lab: any) => ({
                          Test: lab.testName || '-',
                          Result: lab.result || '-',
                          Date: lab.date || '-',
                        }))
                      : 'No lab investigation details available',
                  },
                },
                {
                  sectionTitle: 'Diagnosis Details',
                  info: {
                    Diagnoses: visit?.diagnosisDetails?.length
                      ? visit.diagnosisDetails.map((diag: any) => ({
                          Condition: diag.condition || '-',
                          Date: diag.date || '-',
                          Notes: diag.notes || '-',
                        }))
                      : 'No diagnosis details available',
                  },
                },
                {
                  sectionTitle: 'Medication Details',
                  info: {
                    Medications: visit?.medicationDetails?.length
                      ? visit.medicationDetails.map((med: any) => ({
                          Name: med.name || '-',
                          Dosage: med.dosage || '-',
                          Frequency: med.frequency || '-',
                          StartDate: med.startDate || '-',
                          EndDate: med.endDate || '-',
                        }))
                      : 'No medication details available',
                  },
                },
                {
                  sectionTitle: 'Treatment Details',
                  info: {
                    Treatments: visit?.treatmentDetails
                      ? {
                          Chemotherapy:
                            visit.treatmentDetails.chemoTherapy || 'None',
                          Radiotherapy:
                            visit.treatmentDetails.radioTherapy || 'None',
                          'Palliative Care':
                            visit.treatmentDetails.palliativeCare || 'None',
                          Surgery: visit.treatmentDetails.surgery || 'None',
                          'Hormone Therapy':
                            visit.treatmentDetails.hormoneTherapy || 'None',
                          Symptomatic:
                            visit.treatmentDetails.symptomatic || 'None',
                          'Alternative Treatment':
                            visit.treatmentDetails.alternativeTreatment ||
                            'None',
                          'Medical Procedure':
                            visit.treatmentDetails.medicalProcedureDetails ||
                            'None',
                        }
                      : 'No treatment details available',
                  },
                },
                {
                  sectionTitle: 'Radiology Details',
                  info: {
                    'Radiology Reports': visit?.radiologyDetails?.length
                      ? visit.radiologyDetails.map((rad: any) => ({
                          Type: rad.type || '-',
                          Findings: rad.findings || '-',
                          Date: rad.date || '-',
                        }))
                      : 'No radiology details available',
                  },
                },
                {
                  sectionTitle: 'Outcome Details',
                  info: {
                    'Is Alive': visit?.outcomeDetails?.isAlive ? 'Yes' : 'No',
                    'Death Location':
                      visit?.outcomeDetails?.deathLocation || '-',
                    'Death Date': visit?.outcomeDetails?.deathDate || '-',
                    Referred: visit?.outcomeDetails?.referred ? 'Yes' : 'No',
                  },
                },
                {
                  sectionTitle: 'Causes of Death Details',
                  info: {
                    'Cause of Death':
                      visit?.causesOfDeathDetails?.primaryCause || '-',
                    'Contributing Factors': visit?.causesOfDeathDetails
                      ?.contributingFactors?.length
                      ? visit.causesOfDeathDetails.contributingFactors.join(
                          ', '
                        )
                      : 'None',
                  },
                },
                {
                  sectionTitle: 'Prophylaxis Details',
                  info: {
                    Prophylaxis: visit?.prophylAxisDetails?.length
                      ? visit.prophylAxisDetails.map((pro: any) => ({
                          Type: pro.type || '-',
                          Date: pro.date || '-',
                          Notes: pro.notes || '-',
                        }))
                      : 'No prophylaxis details available',
                  },
                },
                {
                  sectionTitle: 'Vaccination Details',
                  info: {
                    Vaccinations: visit?.vaccinationDetails?.length
                      ? visit.vaccinationDetails.map((vac: any) => ({
                          Name: vac.name || '-',
                          Date: vac.date || '-',
                          Dose: vac.dose || '-',
                        }))
                      : 'No vaccination details available',
                  },
                },
                {
                  sectionTitle: 'Billings Details',
                  info: {
                    Billings: visit?.billingsDetails?.length
                      ? visit.billingsDetails.map((bill: any) => ({
                          Service: bill.service || '-',
                          Amount: bill.amount || '-',
                          Date: bill.date || '-',
                          Status: bill.status || '-',
                        }))
                      : 'No billings details available',
                  },
                },
                {
                  sectionTitle: 'Contact People',
                  info: visit?.demographicDetails?.contactPeople?.length
                    ? visit.demographicDetails.contactPeople
                        .filter((contact: any) => contact.relationShip !== null)
                        .map((contact: any) => ({
                          'First Name': contact.firstName || '-',
                          'Last Name': contact.lastName || '-',
                          'Phone Numbers':
                            contact.phoneNumbers
                              ?.filter((num: any) => num)
                              .join(', ') || 'No contact number',
                          Relationship: contact.relationShip || '-',
                        }))[0] || { 'No emergency contacts available': '' }
                    : { 'No emergency contacts available': '' },
                },
                {
                  sectionTitle: 'Prescription',
                  info: {
                    Prescription:
                      visit?.prescription?.prescription || 'No prescription',
                  },
                },
              ].filter(
                (section) =>
                  section.info !== null &&
                  section.info !== undefined &&
                  (typeof section.info !== 'object' ||
                    Object.keys(section.info).length > 0)
              ),
            }));

            this.basicInfo = {
              'Full Name': `${this.client?.demographicDetails?.fname || ''} ${
                this.client?.demographicDetails?.surname || ''
              }`.trim(),
              'Client ID': this.client?.demographicDetails?.clientID,
              Gender: this.client?.demographicDetails?.gender,
              'Date of Birth': this.client?.demographicDetails?.dateOfBirth,
              NIDA: this.client?.demographicDetails.nida || '-',
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
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

            // console.log(JSON.parse(this.client?.demographicDetails?.addresses))

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

  showDeleteConfirm(
    nzContent: string,
    file: { name: string; url: string }
  ): void {
    console.log(file);
    this.modal.create({
      nzTitle: 'Delete Confirmation',
      nzContent,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzCentered: true,
      nzClassName: 'custom-confirm-modal',
    });
  }

  viewFile(file: { name: string; url: string }) {
    this.modal.create({
      nzTitle: file.name,
      nzContent: DicomViewerComponent,
      nzWidth: '40%',
      nzMaskClosable: false,
      nzData: {
        data: `../../../../../api/v1/files/${file.url}/downloads?id=${this.hcrCode}`,
      },
      nzFooter: null,
    });
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.messageService.success(
        `${info.file.name} file uploaded successfully`
      );
      console.log(info.file.response);
      this.files.push({
        name: info.file.name,
        url: info.file.response?.fileName,
      });
    } else if (info.file.status === 'error') {
      this.messageService.error(`${info.file.name} file upload failed.`);
    }
  }

  getAddress() {
    return `../../../../../api/v1/files/${this.hcrCode}/uploads`;
  }
}
