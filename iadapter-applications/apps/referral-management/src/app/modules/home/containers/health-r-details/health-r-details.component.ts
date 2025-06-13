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
                            'Vital Signs': visit?.clinicalInformation
                              ?.vitalSigns?.length
                              ? visit.clinicalInformation.vitalSigns
                                  .filter((vitalSign: any) =>
                                    Object.values(vitalSign).some(
                                      (value) => value !== null
                                    )
                                  )
                                  .map((vitalSign: any) => ({
                                    'Blood Pressure':
                                      vitalSign.bloodPressure || '-',
                                    Weight: vitalSign.weight || '-',
                                    Temperature: vitalSign.temperature || '-',
                                    Height: vitalSign.height || '-',
                                    Respiration: vitalSign.respiration || '-',
                                    'Pulse Rate': vitalSign.pulseRate || '-',
                                    'Recorded At': vitalSign.dateTime || '-',
                                  }))
                              : 'No vital signs recorded',
                            'Visit Notes': visit?.clinicalInformation
                              ?.visitNotes?.length
                              ? visit.clinicalInformation.visitNotes.map(
                                  (note: any) => ({
                                    'Visit Date': note.date || 'Unknown Date',
                                    'Provider Specialty':
                                      note.providerSpeciality || '-',
                                    'Chief Complaints': note.chiefComplaints
                                      ?.length
                                      ? note.chiefComplaints.join(', ')
                                      : 'None',
                                    // 'History of Present Illness': note
                                    //   .historyOfPresentIllness?.length
                                    'History of Present Illness': note
                                      .historyOfPresentIllness?.length
                                      ? note.historyOfPresentIllness.join(', ')
                                      : 'None',
                                    // 'Review of Other Systems': note.reviewOfOtherSystems
                                    //   ?.length
                                    //   ? note.reviewOfOtherSystems
                                    //       .map((ros: any) => ros.name)
                                    //       .join(', ')
                                    'Review of Other Systems': note
                                      .reviewOfOtherSystems?.length
                                      ? note.reviewOfOtherSystems
                                          .map((ros: any) => ros.name)
                                          .join(', ')
                                      : 'None',
                                    // 'Past Medical History': note.pastMedicalHistory
                                    //   ?.length
                                    'Past Medical History': note
                                      .pastMedicalHistory?.length
                                      ? note.pastMedicalHistory.join(', ')
                                      : 'None',
                                    // 'Family and Social History': note
                                    //   .familyAndSocialHistory?.length
                                    'Family and Social History': note
                                      .familyAndSocialHistory?.length
                                      ? note.familyAndSocialHistory.join(', ')
                                      : 'None',
                                    // 'General Examination': note
                                    //   .generalExaminationObservation?.length
                                    'General Examination': note
                                      .generalExaminationObservation?.length
                                      ? note.generalExaminationObservation.join(
                                          ', '
                                        )
                                      : 'None',
                                    'Local Examination': note.localExamination
                                      ?.length
                                      ? note.localExamination.join(', ')
                                      : 'None',
                                    // 'Systemic Examination': note
                                    //   .systemicExaminationObservation?.length
                                    'Systemic Examination': note
                                      .systemicExaminationObservation?.length
                                      ? note.systemicExaminationObservation.join(
                                          ', '
                                        )
                                      : 'None',
                                    // 'Doctor’s Plan/Suggestion': note
                                    //   .doctorPlanOrSuggestion?.length
                                    'Doctor’s Plan/Suggestion': note
                                      .doctorPlanOrSuggestion?.length
                                      ? note.doctorPlanOrSuggestion.join(', ')
                                      : 'None',
                                  })
                                )
                              : 'No visit notes available',
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
                            // typeof condition === 'object' &&
                            // condition.name
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
                          Name: inv.diseaseCode || '-',
                          Date: inv.dateOccurred || '-',
                          Result: inv.specimenAcceptanceStatus || '-',
                        }))
                      : 'No investigation details available',
                  },
                },
                {
                  sectionTitle: 'Lab Investigation Details',
                  info: {
                    'Lab Results': visit?.labInvestigationDetails?.length
                      ? visit.labInvestigationDetails.map((lab: any) => ({
                          Test: lab.testType || '-',
                          Result: lab.testResults?.[0]?.result || '-',
                          Date: lab.testResultDate || '-',
                        }))
                      : 'No lab investigation details available',
                  },
                },
                {
                  sectionTitle: 'Diagnosis Details',
                  info: {
                    Diagnoses: visit?.diagnosisDetails?.length
                      ? visit.diagnosisDetails.map((diag: any) => ({
                          Condition: diag.diagnosis || '-',
                          Date: diag.diagnosisDate || '-',
                          Notes: diag.diagnosisDescription || '-',
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
                          Dosage: med.dosage?.dose || '-',
                          Frequency: med.dosage?.frequency || '-',
                          StartDate: med.orderDate || '-',
                          EndDate: med.dosage?.dosageDates?.slice(-1)[0] || '-',
                        }))
                      : 'No medication details available',
                  },
                },
                {
                  sectionTitle: 'Treatment Details',
                  info: {
                    Treatments: visit?.treatmentDetails
                      ? {
                          Chemotherapy: visit.treatmentDetails.chemoTherapy
                            ?.length
                            ? `Stage ${visit.treatmentDetails.chemoTherapy[0].stage}, Cycle ${visit.treatmentDetails.chemoTherapy[0].currentChemotherapeuticCycles}/${visit.treatmentDetails.chemoTherapy[0].totalNumberOfExpectedCycles}`
                            : 'None',
                          Radiotherapy: visit.treatmentDetails.radioTherapy
                            ?.length
                            ? `Type ${visit.treatmentDetails.radioTherapy[0].prescription.type}, Total Dose ${visit.treatmentDetails.radioTherapy[0].prescription.totalDose}`
                            : 'None',
                          'Palliative Care':
                            visit.treatmentDetails.palliativeCare || 'None',
                          Surgery: visit.treatmentDetails.surgery?.length
                            ? visit.treatmentDetails.surgery[0].reason
                            : 'None',
                          'Hormone Therapy': visit.treatmentDetails
                            .hormoneTherapy?.length
                            ? `Stage ${visit.treatmentDetails.hormoneTherapy[0].stage}, Cycle ${visit.treatmentDetails.hormoneTherapy[0].currentChemotherapeuticCycles}/${visit.treatmentDetails.hormoneTherapy[0].totalNumberOfExpectedCycles}`
                            : 'None',
                          Symptomatic:
                            visit.treatmentDetails.symptomatic || 'None',
                          'Alternative Treatment':
                            visit.treatmentDetails.alternativeTreatment ||
                            'None',
                          'Medical Procedure': visit.treatmentDetails
                            .medicalProcedureDetails?.length
                            ? visit.treatmentDetails.medicalProcedureDetails[0]
                                .procedureType || 'None'
                            : 'None',
                        }
                      : 'No treatment details available',
                  },
                },
                {
                  sectionTitle: 'Radiology Details',
                  info: {
                    'Radiology Reports': visit?.radiologyDetails?.length
                      ? visit.radiologyDetails.map((rad: any) => ({
                          Type: rad.testTypeName || '-',
                          Findings: rad.testReport || '-',
                          Date: rad.testDate || '-',
                        }))
                      : 'No radiology details available',
                  },
                },
                {
                  sectionTitle: 'Outcome Details',
                  info: {
                    'Is Alive': visit?.outcomeDetails?.isAlive ? 'Yes' : 'No',
                    // 'Death Location':
                    //   visit?.outcomeDetails?.deathLocation || '-',
                    'Death Location':
                      visit?.outcomeDetails?.deathLocation || '-',
                    'Death Date': visit?.outcomeDetails?.deathDate || '-',
                    Referred: visit?.outcomeDetails?.referred ? 'Yes' : 'No',
                  },
                },
                {
                  sectionTitle: 'Causes of Death Details',
                  info: {
                    'Cause of Death': visit?.causesOfDeathDetails?.lineA || '-',
                    'Contributing Factors':
                      [
                        visit?.causesOfDeathDetails?.lineB,
                        visit?.causesOfDeathDetails?.lineC,
                        visit?.causesOfDeathDetails?.lineD,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'None',
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
                          Name: vac.type || '-',
                          Date: vac.date || '-',
                          Dose: vac.dosage || '-',
                        }))
                      : 'No vaccination details available',
                  },
                },
                {
                  sectionTitle: 'Billings Details',
                  info: {
                    Billings: visit?.billingsDetails?.length
                      ? visit.billingsDetails.map((bill: any) => ({
                          Service: bill.billType || '-',
                          Amount: bill.amountBilled || '-',
                          Date: bill.billDate || '-',
                          Status: bill.insuranceName || '-',
                        }))
                      : 'No billings details available',
                  },
                },
                {
                  sectionTitle: 'Contact People',
                  // info: visit?.demographicDetails?.contactPeople?.length
                  //   ? visit.demographicDetails.contactPeople
                  //       .filter((contact: any) => contact.relationShip !== null)
                  //       .map((contact: any) => ({
                  //         'First Name': contact.firstName || '-',
                  //         'Last Name': contact.lastName || '-',
                  //         'Phone Numbers':
                  //           contact.phoneNumbers
                  //             ?.filter((num: any) => num)
                  //             .join(', ') || 'No contact number',
                  //         Relationship: contact.relationShip || '-',
                  //       }))[0] || { 'No emergency contacts available': '' }
                  //   : { 'No emergency contacts available': '' },
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
                {
                  sectionTitle: 'Antenatal Care Details',
                  info: {
                    'ANC Details': visit?.antenatalCareDetails
                      ? {
                          Date: visit.antenatalCareDetails.date || '-',
                          'Pregnancy Age (Weeks)':
                            visit.antenatalCareDetails.pregnancyAgeInWeeks ||
                            '-',
                          'Last ANC Visit':
                            visit.antenatalCareDetails.lastAncVisitDate || '-',
                          'HIV Status':
                            visit.antenatalCareDetails.hivDetails?.status ||
                            '-',
                          'Syphilis Status':
                            visit.antenatalCareDetails.syphilisDetails
                              ?.status || '-',
                          Gravidity:
                            visit.antenatalCareDetails.gravidity || '-',
                          'Counselling Provided': visit.antenatalCareDetails
                            .counselling?.length
                            ? visit.antenatalCareDetails.counselling
                                .map((c: any) => c.name)
                                .join(', ')
                            : 'None',
                        }
                      : 'No antenatal care details available',
                  },
                },
                {
                  sectionTitle: 'Labor and Delivery Details',
                  info: {
                    'Delivery Details': visit?.laborAndDeliveryDetails
                      ? {
                          Date: visit.laborAndDeliveryDetails.date || '-',
                          'Delivery Method':
                            visit.laborAndDeliveryDetails.deliveryMethod
                              ?.name || '-',
                          'Place of Birth':
                            visit.laborAndDeliveryDetails.placeOfBirth || '-',
                          'Pregnancy Age (Weeks)':
                            visit.laborAndDeliveryDetails.pregnancyAgeInWeeks ||
                            '-',
                          'HIV Status':
                            visit.laborAndDeliveryDetails.hivDetails?.status ||
                            '-',
                          'Birth Complications': visit.laborAndDeliveryDetails
                            .birthComplications?.length
                            ? visit.laborAndDeliveryDetails.birthComplications
                                .map((c: any) => c.name)
                                .join(', ')
                            : 'None',
                        }
                      : 'No labor and delivery details available',
                  },
                },
                {
                  sectionTitle: 'Family Planning Details',
                  info: {
                    'Family Planning': visit?.familyPlanningDetails
                      ? {
                          Date: visit.familyPlanningDetails.date || '-',
                          'HIV Status':
                            visit.familyPlanningDetails.hivStatus?.status ||
                            '-',
                          'Breast Cancer Screening': visit.familyPlanningDetails
                            .cancerScreeningDetails?.breastCancer?.screened
                            ? 'Yes'
                            : 'No',
                          'Cervical Cancer Screening': visit
                            .familyPlanningDetails.cancerScreeningDetails
                            ?.cervicalCancer?.screenedWithVIA
                            ? 'Yes'
                            : 'No',
                          'Side Effects': visit.familyPlanningDetails
                            .sideEffects
                            ? Object.keys(
                                visit.familyPlanningDetails.sideEffects
                              )
                                .filter(
                                  (key) =>
                                    visit.familyPlanningDetails.sideEffects[key]
                                )
                                .join(', ')
                            : 'None',
                        }
                      : 'No family planning details available',
                  },
                },
                {
                  sectionTitle: 'Child Health Details',
                  info: {
                    'Child Health': visit?.childHealthDetails
                      ? {
                          'Infant Feeding':
                            visit.childHealthDetails.infantFeeding || '-',
                          'Mother HIV Status':
                            visit.childHealthDetails.motherHivStatus?.status ||
                            '-',
                          'Prophylaxis Provided': visit.childHealthDetails
                            .prophylaxis
                            ? Object.keys(visit.childHealthDetails.prophylaxis)
                                .filter(
                                  (key) =>
                                    visit.childHealthDetails.prophylaxis[key]
                                      .administered
                                )
                                .join(', ')
                            : 'None',
                        }
                      : 'No child health details available',
                  },
                },
                {
                  sectionTitle: 'CPAC Details',
                  info: {
                    'Post-Abortion Care': visit?.cpacDetails
                      ? {
                          'Pregnancy Age (Weeks)':
                            visit.cpacDetails.pregnancyAgeInWeeks || '-',
                          'Cause of Abortion':
                            visit.cpacDetails.causeOfAbortion || '-',
                          'HIV Status':
                            visit.cpacDetails.hivTest?.status || '-',
                          'Medications Provided': visit.cpacDetails
                            .postAbortionsMedications
                            ? Object.keys(
                                visit.cpacDetails.postAbortionsMedications
                              )
                                .filter(
                                  (key) =>
                                    visit.cpacDetails.postAbortionsMedications[
                                      key
                                    ]
                                )
                                .join(', ')
                            : 'None',
                          'Contraceptives Provided': visit.cpacDetails
                            .contraceptives
                            ? Object.keys(visit.cpacDetails.contraceptives)
                                .filter(
                                  (key) => visit.cpacDetails.contraceptives[key]
                                )
                                .join(', ')
                            : 'None',
                        }
                      : 'No CPAC details available',
                  },
                },
                {
                  sectionTitle: 'CECAP Details',
                  info: {
                    'Cancer Screening': visit?.cecap?.cancerScreeningDetails
                      ? {
                          'Breast Cancer Screened': visit.cecap
                            .cancerScreeningDetails.breastCancer?.screened
                            ? 'Yes'
                            : 'No',
                          'Cervical Cancer Screened': visit.cecap
                            .cancerScreeningDetails.cervicalCancer
                            ?.screenedWithVIA
                            ? 'Yes'
                            : 'No',
                          'VIA Test Result': visit.cecap.cancerScreeningDetails
                            .cervicalCancer?.viaTestPositive
                            ? 'Positive'
                            : 'Negative',
                          'Treatments Provided': visit.cecap
                            .cancerScreeningDetails.cervicalCancer
                            ? [
                                visit.cecap.cancerScreeningDetails
                                  .cervicalCancer.treatedWithCryo
                                  ? 'Cryotherapy'
                                  : null,
                                visit.cecap.cancerScreeningDetails
                                  .cervicalCancer.treatedWithThermo
                                  ? 'Thermotherapy'
                                  : null,
                                visit.cecap.cancerScreeningDetails
                                  .cervicalCancer.treatedWithLEEP
                                  ? 'LEEP'
                                  : null,
                              ]
                                .filter(Boolean)
                                .join(', ')
                            : 'None',
                        }
                      : 'No CECAP details available',
                  },
                },
                {
                  sectionTitle: 'Postnatal Details',
                  info: {
                    'Postnatal Care': visit?.postnatalDetails
                      ? {
                          Date: visit.postnatalDetails.date || '-',
                          'HIV Status':
                            visit.postnatalDetails.hivDetails?.status || '-',
                          'Place of Birth':
                            visit.postnatalDetails.placeOfBirth || '-',
                          'APGAR Score':
                            visit.postnatalDetails.APGARScore || '-',
                          Complications:
                            [
                              visit.postnatalDetails.demagedNipples?.provided
                                ? 'Damaged Nipples'
                                : null,
                              visit.postnatalDetails.mastitis?.provided
                                ? 'Mastitis'
                                : null,
                              visit.postnatalDetails.breastAbscess?.provided
                                ? 'Breast Abscess'
                                : null,
                              visit.postnatalDetails.fistula?.provided
                                ? 'Fistula'
                                : null,
                              visit.postnatalDetails.puerperalPsychosis
                                ?.provided
                                ? 'Puerperal Psychosis'
                                : null,
                            ]
                              .filter(Boolean)
                              .join(', ') || 'None',
                        }
                      : 'No postnatal details available',
                  },
                },
                {
                  sectionTitle: 'Referral Details',
                  info: {
                    Referrals: visit?.referralDetails
                      ? {
                          'Referral Date':
                            visit.referralDetails.referralDate || '-',
                          Reason:
                            visit.referralDetails.reason?.join(', ') || '-',
                          'Referral Number':
                            visit.referralDetails.referralNumber || '-',
                          'Referring Clinician':
                            visit.referralDetails.referringClinician?.name ||
                            '-',
                        }
                      : 'No referral details available',
                  },
                },
                {
                  sectionTitle: 'Contraceptives',
                  info: {
                    Contraceptives: visit?.contraceptives
                      ? Object.keys(visit.contraceptives)
                          .filter(
                            (key) =>
                              visit.contraceptives[key] === true ||
                              typeof visit.contraceptives[key] === 'number'
                          )
                          .map((key) =>
                            typeof visit.contraceptives[key] === 'number'
                              ? `${key}: ${visit.contraceptives[key]}`
                              : key
                          )
                          .join(', ') || 'None'
                      : 'No contraceptives provided',
                  },
                },
                {
                  sectionTitle: 'Eye Clinic Details',
                  info: {
                    'Eye Care': visit?.eyeClinicDetails
                      ? {
                          Refracted: visit.eyeClinicDetails.Refracted
                            ? 'Yes'
                            : 'No',
                          'Spectacles Prescribed': visit.eyeClinicDetails
                            .spectaclesPrescribed
                            ? 'Yes'
                            : 'No',
                          'Spectacles Dispensed': visit.eyeClinicDetails
                            .spectacleDispensed
                            ? 'Yes'
                            : 'No',
                          'Low Vision Device': visit.eyeClinicDetails
                            .isDispensedWithLowVisionDevice
                            ? 'Yes'
                            : 'No',
                        }
                      : 'No eye clinic details available',
                  },
                },
                {
                  sectionTitle: 'Admission Details',
                  info: {
                    Admission: visit?.admissionDetails
                      ? {
                          'Admission Date':
                            visit.admissionDetails.admissionDate || '-',
                          Diagnosis:
                            visit.admissionDetails.admissionDiagnosis || '-',
                          'Discharge Date':
                            visit.admissionDetails.dischargedOn || '-',
                          'Discharge Status':
                            visit.admissionDetails.dischargeStatus || '-',
                        }
                      : 'No admission details available',
                  },
                },
                {
                  sectionTitle: 'Appointment Details',
                  info: {
                    Appointments: visit?.appointment?.length
                      ? visit.appointment.map((appt: any) => ({
                          'Appointment ID': appt.appointmentId || '-',
                          Status: appt.appointmentStatus || '-',
                          Service: appt.serviceDetails?.[0]?.serviceName || '-',
                          'Payment Status':
                            appt.paymentDetails?.[0]?.description || '-',
                        }))
                      : 'No appointment details available',
                  },
                },
                {
                  sectionTitle: 'Self-Monitoring Clinical Information',
                  info: {
                    'Vital Signs': visit?.selfMonitoringClinicalInformation
                      ?.vitalSigns?.length
                      ? visit.selfMonitoringClinicalInformation.vitalSigns.map(
                          (vital: any) => ({
                            'Blood Pressure': vital.bloodPressure || '-',
                            Weight: vital.weight || '-',
                            Temperature: vital.temperature || '-',
                            Height: vital.height || '-',
                            Respiration: vital.respiration || '-',
                            'Pulse Rate': vital.pulseRate || '-',
                            'Recorded At': vital.dateTime || '-',
                            Notes: vital.notes || '-',
                          })
                        )
                      : 'No self-monitoring vital signs recorded',
                  },
                },
                {
                  sectionTitle: 'Visit Main Payment Details',
                  info: {
                    Payment: visit?.visitMainPaymentDetails
                      ? {
                          Type: visit.visitMainPaymentDetails.type || '-',
                          'Insurance Name':
                            visit.visitMainPaymentDetails.name || '-',
                          'Insurance ID':
                            visit.visitMainPaymentDetails.insuranceId || '-',
                        }
                      : 'No payment details available',
                  },
                },
                {
                  sectionTitle: 'Cancer Screening',
                  info: {
                    Screening: visit?.otherInformation?.cancerScreening
                      ? {
                          Date:
                            visit.otherInformation.cancerScreening.date || '-',
                          Method:
                            visit.otherInformation.cancerScreening.method ||
                            '-',
                          Result:
                            visit.otherInformation.cancerScreening.results
                              ?.value || '-',
                        }
                      : 'No cancer screening details available',
                  },
                },
              ].filter(
                (section) =>
                  section.info !== null &&
                  section.info !== undefined &&
                  // (typeof section.info !== 'object' ||
                  //   Object.keys(section.info).length > 0)
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
              NIDA: this.client?.demographicDetails?.nida || '-',
              'Phone Numbers': this.client?.demographicDetails?.phoneNumbers,
              Emails: this.client?.demographicDetails?.emails,
              Occupation: this.client?.demographicDetails?.occupation,
              Nationality: this.client?.demographicDetails?.nationality,
              'Marital Status': this.client?.demographicDetails?.maritalStatus,
              Address:
                this.client?.demographicDetails?.addresses
                  ?.map((address: any) => {
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
                  })
                  .join('; ') || '-', // Joined addresses with a semicolon for clarity
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
