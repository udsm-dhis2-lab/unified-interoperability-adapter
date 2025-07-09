import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
} from '@angular/core';
// You MUST import NG_VALUE_ACCESSOR and ControlValueAccessor from @angular/forms
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  DATA_MODEL_DEFINITION,
  ModelField,
  OPERATORS,
} from '../../models/validation.model';

// --- REQUIRED NG-ZORRO MODULES ---
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select'; // <-- IMPORT THIS
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree'; // <-- IMPORT THIS
import { transformFieldsToTreeNodes } from '../../models/data-model.transformer';
import { TreeSelectComponent } from '../app-selection/app-selection';
// import { DATA_MODEL_DEFINITION, ModelField, OPERATORS } from '../data-model';

export interface RuleCondition {
  leftOperandPath?: string;
  operator?: string;
  rightOperandPath?: string;
}

export interface RuleGroup {
  conditions: RuleCondition[];
}

@Component({
  selector: 'app-rule-builder',
  standalone: true,
  templateUrl: './rule-builder.component.html',
  styleUrls: ['./rule-builder.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeSelectComponent,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule,
    NzSelectModule,
    NzTreeSelectModule
  ],
})
export class RuleBuilderComponent implements OnInit, ControlValueAccessor {
  // UI State
  groups: RuleGroup[] = [];

  currentSelection: string[] | null = null;
  defaultExpandedKeys = ['cat-1', 'cat-1-0'];

  readonly categoryNodes: NzTreeNodeOptions[] = [
    {
      title: 'demographicDetails',
      key: 'demographicDetails',
      children: [
        {
          title: 'mrn',
          key: 'demographicDetails.mrn',
          isLeaf: true,
        },
        {
          title: 'firstName',
          key: 'demographicDetails.firstName',
          isLeaf: true,
        },
        {
          title: 'middleName',
          key: 'demographicDetails.middleName',
          isLeaf: true,
        },
        {
          title: 'lastName',
          key: 'demographicDetails.lastName',
          isLeaf: true,
        },
        {
          title: 'dateOfBirth',
          key: 'demographicDetails.dateOfBirth',
          isLeaf: true,
        },
        {
          title: 'gender',
          key: 'demographicDetails.gender',
          isLeaf: true,
        },
        {
          title: 'phoneNumbers',
          key: 'demographicDetails.phoneNumbers',
          children: [
            {
              title: '0',
              key: 'demographicDetails.phoneNumbers.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'demographicDetails.phoneNumbers.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'demographicDetails.phoneNumbers.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'demographicDetails.phoneNumbers.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'demographicDetails.phoneNumbers.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'demographicDetails.phoneNumbers.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'demographicDetails.phoneNumbers.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'demographicDetails.phoneNumbers.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'demographicDetails.phoneNumbers.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'demographicDetails.phoneNumbers.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'demographicDetails.phoneNumbers.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'demographicDetails.phoneNumbers.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'demographicDetails.phoneNumbers.12',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'emails',
          key: 'demographicDetails.emails',
          children: [
            {
              title: '0',
              key: 'demographicDetails.emails.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'demographicDetails.emails.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'demographicDetails.emails.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'demographicDetails.emails.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'demographicDetails.emails.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'demographicDetails.emails.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'demographicDetails.emails.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'demographicDetails.emails.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'demographicDetails.emails.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'demographicDetails.emails.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'demographicDetails.emails.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'demographicDetails.emails.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'demographicDetails.emails.12',
              isLeaf: true,
            },
            {
              title: '13',
              key: 'demographicDetails.emails.13',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'occupation',
          key: 'demographicDetails.occupation',
          isLeaf: true,
        },
        {
          title: 'maritalStatus',
          key: 'demographicDetails.maritalStatus',
          isLeaf: true,
        },
        {
          title: 'nationality',
          key: 'demographicDetails.nationality',
          isLeaf: true,
        },
        {
          title: 'addresses',
          key: 'demographicDetails.addresses',
          children: [
            {
              title: 'village',
              key: 'demographicDetails.addresses.village',
              isLeaf: true,
            },
            {
              title: 'ward',
              key: 'demographicDetails.addresses.ward',
              isLeaf: true,
            },
            {
              title: 'district',
              key: 'demographicDetails.addresses.district',
              isLeaf: true,
            },
            {
              title: 'region',
              key: 'demographicDetails.addresses.region',
              isLeaf: true,
            },
            {
              title: 'country',
              key: 'demographicDetails.addresses.country',
              isLeaf: true,
            },
            {
              title: 'category',
              key: 'demographicDetails.addresses.category',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'identifiers',
          key: 'demographicDetails.identifiers',
          children: [
            {
              title: 'type',
              key: 'demographicDetails.identifiers.type',
              isLeaf: true,
            },
            {
              title: 'id',
              key: 'demographicDetails.identifiers.id',
              isLeaf: true,
            },
            {
              title: 'preferred',
              key: 'demographicDetails.identifiers.preferred',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'contactPeople',
          key: 'demographicDetails.contactPeople',
          children: [
            {
              title: 'firstName',
              key: 'demographicDetails.contactPeople.firstName',
              isLeaf: true,
            },
            {
              title: 'lastName',
              key: 'demographicDetails.contactPeople.lastName',
              isLeaf: true,
            },
            {
              title: 'phoneNumbers',
              key: 'demographicDetails.contactPeople.phoneNumbers',
              children: [
                {
                  title: '0',
                  key: 'demographicDetails.contactPeople.phoneNumbers.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'demographicDetails.contactPeople.phoneNumbers.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'demographicDetails.contactPeople.phoneNumbers.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'demographicDetails.contactPeople.phoneNumbers.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'demographicDetails.contactPeople.phoneNumbers.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'demographicDetails.contactPeople.phoneNumbers.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'demographicDetails.contactPeople.phoneNumbers.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'demographicDetails.contactPeople.phoneNumbers.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'demographicDetails.contactPeople.phoneNumbers.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'demographicDetails.contactPeople.phoneNumbers.9',
                  isLeaf: true,
                },
                {
                  title: '10',
                  key: 'demographicDetails.contactPeople.phoneNumbers.10',
                  isLeaf: true,
                },
                {
                  title: '11',
                  key: 'demographicDetails.contactPeople.phoneNumbers.11',
                  isLeaf: true,
                },
                {
                  title: '12',
                  key: 'demographicDetails.contactPeople.phoneNumbers.12',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'relationShip',
              key: 'demographicDetails.contactPeople.relationShip',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'paymentDetails',
          key: 'demographicDetails.paymentDetails',
          children: [
            {
              title: 'shortName',
              key: 'demographicDetails.paymentDetails.shortName',
              isLeaf: true,
            },
            {
              title: 'type',
              key: 'demographicDetails.paymentDetails.type',
              isLeaf: true,
            },
            {
              title: 'insuranceCode',
              key: 'demographicDetails.paymentDetails.insuranceCode',
              isLeaf: true,
            },
            {
              title: 'name',
              key: 'demographicDetails.paymentDetails.name',
              isLeaf: true,
            },
            {
              title: 'insuranceId',
              key: 'demographicDetails.paymentDetails.insuranceId',
              isLeaf: true,
            },
            {
              title: 'policyNumber',
              key: 'demographicDetails.paymentDetails.policyNumber',
              isLeaf: true,
            },
            {
              title: 'groupNumber',
              key: 'demographicDetails.paymentDetails.groupNumber',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'visitDetails',
      key: 'visitDetails',
      children: [
        {
          title: 'id',
          key: 'visitDetails.id',
          isLeaf: true,
        },
        {
          title: 'visitDate',
          key: 'visitDetails.visitDate',
          isLeaf: true,
        },
        {
          title: 'newThisYear',
          key: 'visitDetails.newThisYear',
          isLeaf: true,
        },
        {
          title: 'isNew',
          key: 'visitDetails.isNew',
          isLeaf: true,
        },
        {
          title: 'referredIn',
          key: 'visitDetails.referredIn',
          isLeaf: true,
        },
        {
          title: 'closedDate',
          key: 'visitDetails.closedDate',
          isLeaf: true,
        },
        {
          title: 'visitType',
          key: 'visitDetails.visitType',
          isLeaf: true,
        },
        {
          title: 'disabled',
          key: 'visitDetails.disabled',
          isLeaf: true,
        },
        {
          title: 'careServices',
          key: 'visitDetails.careServices',
          children: [
            {
              title: 'careType',
              key: 'visitDetails.careServices.careType',
              isLeaf: true,
            },
            {
              title: 'visitNumber',
              key: 'visitDetails.careServices.visitNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'attendedSpecialist',
          key: 'visitDetails.attendedSpecialist',
          children: [
            {
              title: 'superSpecialist',
              key: 'visitDetails.attendedSpecialist.superSpecialist',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'serviceComplaints',
          key: 'visitDetails.serviceComplaints',
          children: [
            {
              title: 'providedComplaints',
              key: 'visitDetails.serviceComplaints.providedComplaints',
              isLeaf: true,
            },
            {
              title: 'complaints',
              key: 'visitDetails.serviceComplaints.complaints',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'appointment',
      key: 'appointment',
      children: [
        {
          title: 'appointmentId',
          key: 'appointment.appointmentId',
          isLeaf: true,
        },
        {
          title: 'hfrCode',
          key: 'appointment.hfrCode',
          isLeaf: true,
        },
        {
          title: 'appointmentStatus',
          key: 'appointment.appointmentStatus',
          isLeaf: true,
        },
        {
          title: 'paymentDetails',
          key: 'appointment.paymentDetails',
          children: [
            {
              title: 'controlNumber',
              key: 'appointment.paymentDetails.controlNumber',
              isLeaf: true,
            },
            {
              title: 'statusCode',
              key: 'appointment.paymentDetails.statusCode',
              isLeaf: true,
            },
            {
              title: 'description',
              key: 'appointment.paymentDetails.description',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'serviceDetails',
          key: 'appointment.serviceDetails',
          children: [
            {
              title: 'serviceCode',
              key: 'appointment.serviceDetails.serviceCode',
              isLeaf: true,
            },
            {
              title: 'serviceName',
              key: 'appointment.serviceDetails.serviceName',
              isLeaf: true,
            },
            {
              title: 'shortName',
              key: 'appointment.serviceDetails.shortName',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'selfMonitoringClinicalInformation',
      key: 'selfMonitoringClinicalInformation',
      children: [
        {
          title: 'vitalSigns',
          key: 'selfMonitoringClinicalInformation.vitalSigns',
          children: [
            {
              title: 'bloodPressure',
              key: 'selfMonitoringClinicalInformation.vitalSigns.bloodPressure',
              isLeaf: true,
            },
            {
              title: 'weight',
              key: 'selfMonitoringClinicalInformation.vitalSigns.weight',
              isLeaf: true,
            },
            {
              title: 'temperature',
              key: 'selfMonitoringClinicalInformation.vitalSigns.temperature',
              isLeaf: true,
            },
            {
              title: 'height',
              key: 'selfMonitoringClinicalInformation.vitalSigns.height',
              isLeaf: true,
            },
            {
              title: 'respiration',
              key: 'selfMonitoringClinicalInformation.vitalSigns.respiration',
              isLeaf: true,
            },
            {
              title: 'pulseRate',
              key: 'selfMonitoringClinicalInformation.vitalSigns.pulseRate',
              isLeaf: true,
            },
            {
              title: 'dateTime',
              key: 'selfMonitoringClinicalInformation.vitalSigns.dateTime',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'selfMonitoringClinicalInformation.vitalSigns.notes',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'clinicalInformation',
      key: 'clinicalInformation',
      children: [
        {
          title: 'vitalSigns',
          key: 'clinicalInformation.vitalSigns',
          children: [
            {
              title: 'bloodPressure',
              key: 'clinicalInformation.vitalSigns.bloodPressure',
              isLeaf: true,
            },
            {
              title: 'weight',
              key: 'clinicalInformation.vitalSigns.weight',
              isLeaf: true,
            },
            {
              title: 'temperature',
              key: 'clinicalInformation.vitalSigns.temperature',
              isLeaf: true,
            },
            {
              title: 'height',
              key: 'clinicalInformation.vitalSigns.height',
              isLeaf: true,
            },
            {
              title: 'respiration',
              key: 'clinicalInformation.vitalSigns.respiration',
              isLeaf: true,
            },
            {
              title: 'pulseRate',
              key: 'clinicalInformation.vitalSigns.pulseRate',
              isLeaf: true,
            },
            {
              title: 'dateTime',
              key: 'clinicalInformation.vitalSigns.dateTime',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'clinicalInformation.vitalSigns.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'visitNotes',
          key: 'clinicalInformation.visitNotes',
          children: [
            {
              title: 'date',
              key: 'clinicalInformation.visitNotes.date',
              isLeaf: true,
            },
            {
              title: 'chiefComplaints',
              key: 'clinicalInformation.visitNotes.chiefComplaints',
              children: [
                {
                  title: '0',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.9',
                  isLeaf: true,
                },
                {
                  title: '10',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.10',
                  isLeaf: true,
                },
                {
                  title: '11',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.11',
                  isLeaf: true,
                },
                {
                  title: '12',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.12',
                  isLeaf: true,
                },
                {
                  title: '13',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.13',
                  isLeaf: true,
                },
                {
                  title: '14',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.14',
                  isLeaf: true,
                },
                {
                  title: '15',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.15',
                  isLeaf: true,
                },
                {
                  title: '16',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.16',
                  isLeaf: true,
                },
                {
                  title: '17',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.17',
                  isLeaf: true,
                },
                {
                  title: '18',
                  key: 'clinicalInformation.visitNotes.chiefComplaints.18',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'injured',
              key: 'clinicalInformation.visitNotes.injured',
              isLeaf: true,
            },
            {
              title: 'historyOfPresentIllness',
              key: 'clinicalInformation.visitNotes.historyOfPresentIllness',
            },
            {
              title: 'reviewOfOtherSystems',
              key: 'clinicalInformation.visitNotes.reviewOfOtherSystems',
              children: [
                {
                  title: 'code',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.code',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.name',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'clinicalInformation.visitNotes.reviewOfOtherSystems.notes',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'pastMedicalHistory',
              key: 'clinicalInformation.visitNotes.pastMedicalHistory',
            },
            {
              title: 'familyAndSocialHistory',
              key: 'clinicalInformation.visitNotes.familyAndSocialHistory',
            },
            {
              title: 'generalExaminationObservation',
              key: 'clinicalInformation.visitNotes.generalExaminationObservation',
              isLeaf: true,
            },
            {
              title: 'localExamination',
              key: 'clinicalInformation.visitNotes.localExamination',
              isLeaf: true,
            },
            {
              title: 'systemicExaminationObservation',
              key: 'clinicalInformation.visitNotes.systemicExaminationObservation',
              children: [
                {
                  title: 'code',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.code',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.name',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'clinicalInformation.visitNotes.systemicExaminationObservation.notes',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'doctorPlanOrSuggestion',
              key: 'clinicalInformation.visitNotes.doctorPlanOrSuggestion',
              isLeaf: true,
            },
            {
              title: 'providerSpeciality',
              key: 'clinicalInformation.visitNotes.providerSpeciality',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'allergies',
      key: 'allergies',
      children: [
        {
          title: 'code',
          key: 'allergies.code',
          isLeaf: true,
        },
        {
          title: 'category',
          key: 'allergies.category',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'allergies.name',
          isLeaf: true,
        },
        {
          title: 'criticality',
          key: 'allergies.criticality',
          isLeaf: true,
        },
        {
          title: 'verificationStatus',
          key: 'allergies.verificationStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'chronicConditions',
      key: 'chronicConditions',
      children: [
        {
          title: 'code',
          key: 'chronicConditions.code',
          isLeaf: true,
        },
        {
          title: 'category',
          key: 'chronicConditions.category',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'chronicConditions.name',
          isLeaf: true,
        },
        {
          title: 'criticality',
          key: 'chronicConditions.criticality',
          isLeaf: true,
        },
        {
          title: 'verificationStatus',
          key: 'chronicConditions.verificationStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'lifeStyleInformation',
      key: 'lifeStyleInformation',
      children: [
        {
          title: 'smoking',
          key: 'lifeStyleInformation.smoking',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.smoking.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.smoking.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'alcoholUse',
          key: 'lifeStyleInformation.alcoholUse',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.alcoholUse.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.alcoholUse.notes',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'drugUse',
          key: 'lifeStyleInformation.drugUse',
          children: [
            {
              title: 'using',
              key: 'lifeStyleInformation.drugUse.using',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'lifeStyleInformation.drugUse.notes',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'investigationDetails',
      key: 'investigationDetails',
      children: [
        {
          title: 'dateOccurred',
          key: 'investigationDetails.dateOccurred',
          isLeaf: true,
        },
        {
          title: 'caseClassification',
          key: 'investigationDetails.caseClassification',
          isLeaf: true,
        },
        {
          title: 'daysSinceSymptoms',
          key: 'investigationDetails.daysSinceSymptoms',
          isLeaf: true,
        },
        {
          title: 'diseaseCode',
          key: 'investigationDetails.diseaseCode',
          isLeaf: true,
        },
        {
          title: 'labSpecimenTaken',
          key: 'investigationDetails.labSpecimenTaken',
          isLeaf: true,
        },
        {
          title: 'specimenSentToLab',
          key: 'investigationDetails.specimenSentToLab',
          isLeaf: true,
        },
        {
          title: 'vaccinated',
          key: 'investigationDetails.vaccinated',
          isLeaf: true,
        },
        {
          title: 'specimenCollected',
          key: 'investigationDetails.specimenCollected',
          isLeaf: true,
        },
        {
          title: 'dateSpecimenCollected',
          key: 'investigationDetails.dateSpecimenCollected',
          isLeaf: true,
        },
        {
          title: 'specimenCollectedFrom',
          key: 'investigationDetails.specimenCollectedFrom',
          isLeaf: true,
        },
        {
          title: 'specimenID',
          key: 'investigationDetails.specimenID',
          isLeaf: true,
        },
        {
          title: 'typeOfSpecimen',
          key: 'investigationDetails.typeOfSpecimen',
          isLeaf: true,
        },
        {
          title: 'dateSpecimenSentToLab',
          key: 'investigationDetails.dateSpecimenSentToLab',
          isLeaf: true,
        },
        {
          title: 'laboratoryName',
          key: 'investigationDetails.laboratoryName',
          isLeaf: true,
        },
        {
          title: 'typeOfTest',
          key: 'investigationDetails.typeOfTest',
          isLeaf: true,
        },
        {
          title: 'specimenAcceptanceStatus',
          key: 'investigationDetails.specimenAcceptanceStatus',
          isLeaf: true,
        },
        {
          title: 'specimenCollectorName',
          key: 'investigationDetails.specimenCollectorName',
          isLeaf: true,
        },
        {
          title: 'specimenCollectorContactNumber',
          key: 'investigationDetails.specimenCollectorContactNumber',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'labInvestigationDetails',
      key: 'labInvestigationDetails',
      children: [
        {
          title: 'testCode',
          key: 'labInvestigationDetails.testCode',
          isLeaf: true,
        },
        {
          title: 'testOrderDate',
          key: 'labInvestigationDetails.testOrderDate',
          isLeaf: true,
        },
        {
          title: 'testSampleId',
          key: 'labInvestigationDetails.testSampleId',
          isLeaf: true,
        },
        {
          title: 'testOrderId',
          key: 'labInvestigationDetails.testOrderId',
          isLeaf: true,
        },
        {
          title: 'testResultDate',
          key: 'labInvestigationDetails.testResultDate',
          isLeaf: true,
        },
        {
          title: 'testStatus',
          key: 'labInvestigationDetails.testStatus',
          isLeaf: true,
        },
        {
          title: 'testType',
          key: 'labInvestigationDetails.testType',
          isLeaf: true,
        },
        {
          title: 'standardCode',
          key: 'labInvestigationDetails.standardCode',
          isLeaf: true,
        },
        {
          title: 'codeType',
          key: 'labInvestigationDetails.codeType',
          isLeaf: true,
        },
        {
          title: 'testResults',
          key: 'labInvestigationDetails.testResults',
          children: [
            {
              title: 'parameter',
              key: 'labInvestigationDetails.testResults.parameter',
              isLeaf: true,
            },
            {
              title: 'releaseDate',
              key: 'labInvestigationDetails.testResults.releaseDate',
              isLeaf: true,
            },
            {
              title: 'result',
              key: 'labInvestigationDetails.testResults.result',
              isLeaf: true,
            },
            {
              title: 'codedValue',
              key: 'labInvestigationDetails.testResults.codedValue',
              isLeaf: true,
            },
            {
              title: 'valueType',
              key: 'labInvestigationDetails.testResults.valueType',
              isLeaf: true,
            },
            {
              title: 'standardCode',
              key: 'labInvestigationDetails.testResults.standardCode',
              isLeaf: true,
            },
            {
              title: 'codeType',
              key: 'labInvestigationDetails.testResults.codeType',
              isLeaf: true,
            },
            {
              title: 'unit',
              key: 'labInvestigationDetails.testResults.unit',
              isLeaf: true,
            },
            {
              title: 'lowRange',
              key: 'labInvestigationDetails.testResults.lowRange',
              isLeaf: true,
            },
            {
              title: 'hiRange',
              key: 'labInvestigationDetails.testResults.hiRange',
              isLeaf: true,
            },
            {
              title: 'remarks',
              key: 'labInvestigationDetails.testResults.remarks',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'diagnosisDetails',
      key: 'diagnosisDetails',
      children: [
        {
          title: 'certainty',
          key: 'diagnosisDetails.certainty',
          isLeaf: true,
        },
        {
          title: 'diagnosis',
          key: 'diagnosisDetails.diagnosis',
          isLeaf: true,
        },
        {
          title: 'diagnosisCode',
          key: 'diagnosisDetails.diagnosisCode',
          isLeaf: true,
        },
        {
          title: 'diagnosisDate',
          key: 'diagnosisDetails.diagnosisDate',
          isLeaf: true,
        },
        {
          title: 'diagnosisDescription',
          key: 'diagnosisDetails.diagnosisDescription',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'medicationDetails',
      key: 'medicationDetails',
      children: [
        {
          title: 'name',
          key: 'medicationDetails.name',
          isLeaf: true,
        },
        {
          title: 'code',
          key: 'medicationDetails.code',
          isLeaf: true,
        },
        {
          title: 'codeStandard',
          key: 'medicationDetails.codeStandard',
          isLeaf: true,
        },
        {
          title: 'dosage',
          key: 'medicationDetails.dosage',
          children: [
            {
              title: 'dose',
              key: 'medicationDetails.dosage.dose',
              isLeaf: true,
            },
            {
              title: 'frequency',
              key: 'medicationDetails.dosage.frequency',
              isLeaf: true,
            },
            {
              title: 'route',
              key: 'medicationDetails.dosage.route',
              isLeaf: true,
            },
            {
              title: 'instructions',
              key: 'medicationDetails.dosage.instructions',
              isLeaf: true,
            },
            {
              title: 'quantity',
              key: 'medicationDetails.dosage.quantity',
              isLeaf: true,
            },
            {
              title: 'duration',
              key: 'medicationDetails.dosage.duration',
              isLeaf: true,
            },
            {
              title: 'days',
              key: 'medicationDetails.dosage.days',
            },
            {
              title: 'schedule',
              key: 'medicationDetails.dosage.schedule',
              children: [
                {
                  title: '0',
                  key: 'medicationDetails.dosage.schedule.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'medicationDetails.dosage.schedule.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'medicationDetails.dosage.schedule.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'medicationDetails.dosage.schedule.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'medicationDetails.dosage.schedule.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'medicationDetails.dosage.schedule.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'medicationDetails.dosage.schedule.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'medicationDetails.dosage.schedule.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'medicationDetails.dosage.schedule.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'medicationDetails.dosage.schedule.9',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'dosageDates',
              key: 'medicationDetails.dosage.dosageDates',
              children: [
                {
                  title: '0',
                  key: 'medicationDetails.dosage.dosageDates.0',
                  isLeaf: true,
                },
                {
                  title: '1',
                  key: 'medicationDetails.dosage.dosageDates.1',
                  isLeaf: true,
                },
                {
                  title: '2',
                  key: 'medicationDetails.dosage.dosageDates.2',
                  isLeaf: true,
                },
                {
                  title: '3',
                  key: 'medicationDetails.dosage.dosageDates.3',
                  isLeaf: true,
                },
                {
                  title: '4',
                  key: 'medicationDetails.dosage.dosageDates.4',
                  isLeaf: true,
                },
                {
                  title: '5',
                  key: 'medicationDetails.dosage.dosageDates.5',
                  isLeaf: true,
                },
                {
                  title: '6',
                  key: 'medicationDetails.dosage.dosageDates.6',
                  isLeaf: true,
                },
                {
                  title: '7',
                  key: 'medicationDetails.dosage.dosageDates.7',
                  isLeaf: true,
                },
                {
                  title: '8',
                  key: 'medicationDetails.dosage.dosageDates.8',
                  isLeaf: true,
                },
                {
                  title: '9',
                  key: 'medicationDetails.dosage.dosageDates.9',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'issued',
          key: 'medicationDetails.issued',
          children: [
            {
              title: 'quantity',
              key: 'medicationDetails.issued.quantity',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'orderDate',
          key: 'medicationDetails.orderDate',
          isLeaf: true,
        },
        {
          title: 'periodOfMedication',
          key: 'medicationDetails.periodOfMedication',
          isLeaf: true,
        },
        {
          title: 'treatmentType',
          key: 'medicationDetails.treatmentType',
          isLeaf: true,
        },
        {
          title: 'refillStatus',
          key: 'medicationDetails.refillStatus',
          isLeaf: true,
        },
        {
          title: 'currentRefill',
          key: 'medicationDetails.currentRefill',
          isLeaf: true,
        },
        {
          title: 'maxRefill',
          key: 'medicationDetails.maxRefill',
          isLeaf: true,
        },
        {
          title: 'paymentDetails',
          key: 'medicationDetails.paymentDetails',
          children: [
            {
              title: 'controlNumber',
              key: 'medicationDetails.paymentDetails.controlNumber',
              isLeaf: true,
            },
            {
              title: 'statusCode',
              key: 'medicationDetails.paymentDetails.statusCode',
              isLeaf: true,
            },
            {
              title: 'status',
              key: 'medicationDetails.paymentDetails.status',
              isLeaf: true,
            },
            {
              title: 'type',
              key: 'medicationDetails.paymentDetails.type',
              isLeaf: true,
            },
            {
              title: 'description',
              key: 'medicationDetails.paymentDetails.description',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'treatmentDetails',
      key: 'treatmentDetails',
      children: [
        {
          title: 'chemoTherapy',
          key: 'treatmentDetails.chemoTherapy',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.chemoTherapy.diagnosis',
              isLeaf: true,
            },
            {
              title: 'regiment',
              key: 'treatmentDetails.chemoTherapy.regiment',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'treatmentDetails.chemoTherapy.stage',
              isLeaf: true,
            },
            {
              title: 'totalNumberOfExpectedCycles',
              key: 'treatmentDetails.chemoTherapy.totalNumberOfExpectedCycles',
              isLeaf: true,
            },
            {
              title: 'currentChemotherapeuticCycles',
              key: 'treatmentDetails.chemoTherapy.currentChemotherapeuticCycles',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'radioTherapy',
          key: 'treatmentDetails.radioTherapy',
          children: [
            {
              title: 'prescription',
              key: 'treatmentDetails.radioTherapy.prescription',
              children: [
                {
                  title: 'type',
                  key: 'treatmentDetails.radioTherapy.prescription.type',
                  isLeaf: true,
                },
                {
                  title: 'intention',
                  key: 'treatmentDetails.radioTherapy.prescription.intention',
                  isLeaf: true,
                },
                {
                  title: 'technique',
                  key: 'treatmentDetails.radioTherapy.prescription.technique',
                  isLeaf: true,
                },
                {
                  title: 'site',
                  key: 'treatmentDetails.radioTherapy.prescription.site',
                  isLeaf: true,
                },
                {
                  title: 'dailyDose',
                  key: 'treatmentDetails.radioTherapy.prescription.dailyDose',
                  isLeaf: true,
                },
                {
                  title: 'totalDose',
                  key: 'treatmentDetails.radioTherapy.prescription.totalDose',
                  isLeaf: true,
                },
                {
                  title: 'startDate',
                  key: 'treatmentDetails.radioTherapy.prescription.startDate',
                  isLeaf: true,
                },
                {
                  title: 'dosageDates',
                  key: 'treatmentDetails.radioTherapy.prescription.dosageDates',
                  children: [
                    {
                      title: '0',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.0',
                      isLeaf: true,
                    },
                    {
                      title: '1',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.1',
                      isLeaf: true,
                    },
                    {
                      title: '2',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.2',
                      isLeaf: true,
                    },
                    {
                      title: '3',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.3',
                      isLeaf: true,
                    },
                    {
                      title: '4',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.4',
                      isLeaf: true,
                    },
                    {
                      title: '5',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.5',
                      isLeaf: true,
                    },
                    {
                      title: '6',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.6',
                      isLeaf: true,
                    },
                    {
                      title: '7',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.7',
                      isLeaf: true,
                    },
                    {
                      title: '8',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.8',
                      isLeaf: true,
                    },
                    {
                      title: '9',
                      key: 'treatmentDetails.radioTherapy.prescription.dosageDates.9',
                      isLeaf: true,
                    },
                  ],
                },
                {
                  title: 'administrationDates',
                  key: 'treatmentDetails.radioTherapy.prescription.administrationDates',
                },
                {
                  title: 'remarks',
                  key: 'treatmentDetails.radioTherapy.prescription.remarks',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'report',
              key: 'treatmentDetails.radioTherapy.report',
              children: [
                {
                  title: 'date',
                  key: 'treatmentDetails.radioTherapy.report.date',
                  isLeaf: true,
                },
                {
                  title: 'MU',
                  key: 'treatmentDetails.radioTherapy.report.MU',
                  isLeaf: true,
                },
                {
                  title: 'attachments',
                  key: 'treatmentDetails.radioTherapy.report.attachments',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'surgery',
          key: 'treatmentDetails.surgery',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.surgery.diagnosis',
              isLeaf: true,
            },
            {
              title: 'reason',
              key: 'treatmentDetails.surgery.reason',
              isLeaf: true,
            },
            {
              title: 'report',
              key: 'treatmentDetails.surgery.report',
              children: [
                {
                  title: 'indication',
                  key: 'treatmentDetails.surgery.report.indication',
                  isLeaf: true,
                },
                {
                  title: 'steps',
                  key: 'treatmentDetails.surgery.report.steps',
                  isLeaf: true,
                },
                {
                  title: 'remarks',
                  key: 'treatmentDetails.surgery.report.remarks',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'hormoneTherapy',
          key: 'treatmentDetails.hormoneTherapy',
          children: [
            {
              title: 'diagnosis',
              key: 'treatmentDetails.hormoneTherapy.diagnosis',
              isLeaf: true,
            },
            {
              title: 'regiment',
              key: 'treatmentDetails.hormoneTherapy.regiment',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'treatmentDetails.hormoneTherapy.stage',
              isLeaf: true,
            },
            {
              title: 'totalNumberOfExpectedCycles',
              key: 'treatmentDetails.hormoneTherapy.totalNumberOfExpectedCycles',
              isLeaf: true,
            },
            {
              title: 'currentChemotherapeuticCycles',
              key: 'treatmentDetails.hormoneTherapy.currentChemotherapeuticCycles',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'symptomatic',
          key: 'treatmentDetails.symptomatic',
          isLeaf: true,
        },
        {
          title: 'alternativeTreatment',
          key: 'treatmentDetails.alternativeTreatment',
          isLeaf: true,
        },
        {
          title: 'medicalProcedureDetails',
          key: 'treatmentDetails.medicalProcedureDetails',
          children: [
            {
              title: 'procedureDate',
              key: 'treatmentDetails.medicalProcedureDetails.procedureDate',
              isLeaf: true,
            },
            {
              title: 'procedureType',
              key: 'treatmentDetails.medicalProcedureDetails.procedureType',
              isLeaf: true,
            },
            {
              title: 'findings',
              key: 'treatmentDetails.medicalProcedureDetails.findings',
              isLeaf: true,
            },
            {
              title: 'diagnosis',
              key: 'treatmentDetails.medicalProcedureDetails.diagnosis',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'eyeClinicDetails',
      key: 'eyeClinicDetails',
      children: [
        {
          title: 'Refracted',
          key: 'eyeClinicDetails.Refracted',
          isLeaf: true,
        },
        {
          title: 'spectaclesPrescribed',
          key: 'eyeClinicDetails.spectaclesPrescribed',
          isLeaf: true,
        },
        {
          title: 'spectacleDispensed',
          key: 'eyeClinicDetails.spectacleDispensed',
          isLeaf: true,
        },
        {
          title: 'contactLenseDispensed',
          key: 'eyeClinicDetails.contactLenseDispensed',
          isLeaf: true,
        },
        {
          title: 'prescribedWithLowVision',
          key: 'eyeClinicDetails.prescribedWithLowVision',
          isLeaf: true,
        },
        {
          title: 'diagnosedWithLowVisionI',
          key: 'eyeClinicDetails.diagnosedWithLowVisionI',
          isLeaf: true,
        },
        {
          title: 'diagnosedWithLowVisionII',
          key: 'eyeClinicDetails.diagnosedWithLowVisionII',
          isLeaf: true,
        },
        {
          title: 'isDispensedWithLowVisionDevice',
          key: 'eyeClinicDetails.isDispensedWithLowVisionDevice',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'radiologyDetails',
      key: 'radiologyDetails',
      children: [
        {
          title: 'testDate',
          key: 'radiologyDetails.testDate',
          isLeaf: true,
        },
        {
          title: 'testTypeName',
          key: 'radiologyDetails.testTypeName',
          isLeaf: true,
        },
        {
          title: 'testTypeCode',
          key: 'radiologyDetails.testTypeCode',
          isLeaf: true,
        },
        {
          title: 'testReport',
          key: 'radiologyDetails.testReport',
          isLeaf: true,
        },
        {
          title: 'bodySite',
          key: 'radiologyDetails.bodySite',
          isLeaf: true,
        },
        {
          title: 'url',
          key: 'radiologyDetails.url',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'admissionDetails',
      key: 'admissionDetails',
      children: [
        {
          title: 'admissionDate',
          key: 'admissionDetails.admissionDate',
          isLeaf: true,
        },
        {
          title: 'admissionDiagnosis',
          key: 'admissionDetails.admissionDiagnosis',
          isLeaf: true,
        },
        {
          title: 'dischargedOn',
          key: 'admissionDetails.dischargedOn',
          isLeaf: true,
        },
        {
          title: 'dischargeStatus',
          key: 'admissionDetails.dischargeStatus',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'outcomeDetails',
      key: 'outcomeDetails',
      children: [
        {
          title: 'isAlive',
          key: 'outcomeDetails.isAlive',
          isLeaf: true,
        },
        {
          title: 'deathLocation',
          key: 'outcomeDetails.deathLocation',
          isLeaf: true,
        },
        {
          title: 'deathDate',
          key: 'outcomeDetails.deathDate',
          isLeaf: true,
        },
        {
          title: 'contactTracing',
          key: 'outcomeDetails.contactTracing',
          isLeaf: true,
        },
        {
          title: 'investigationConducted',
          key: 'outcomeDetails.investigationConducted',
          isLeaf: true,
        },
        {
          title: 'quarantined',
          key: 'outcomeDetails.quarantined',
          isLeaf: true,
        },
        {
          title: 'dischargedLocation',
          key: 'outcomeDetails.dischargedLocation',
          isLeaf: true,
        },
        {
          title: 'referred',
          key: 'outcomeDetails.referred',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'otherInformation',
      key: 'otherInformation',
      children: [
        {
          title: 'cancerScreening',
          key: 'otherInformation.cancerScreening',
          children: [
            {
              title: 'date',
              key: 'otherInformation.cancerScreening.date',
              isLeaf: true,
            },
            {
              title: 'method',
              key: 'otherInformation.cancerScreening.method',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'otherInformation.cancerScreening.code',
              isLeaf: true,
            },
            {
              title: 'results',
              key: 'otherInformation.cancerScreening.results',
              children: [
                {
                  title: 'date',
                  key: 'otherInformation.cancerScreening.results.date',
                  isLeaf: true,
                },
                {
                  title: 'value',
                  key: 'otherInformation.cancerScreening.results.value',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'otherInformation.cancerScreening.results.code',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'cancerDetails',
          key: 'otherInformation.cancerDetails',
          children: [
            {
              title: 'incidenceDate',
              key: 'otherInformation.cancerDetails.incidenceDate',
              isLeaf: true,
            },
            {
              title: 'topography',
              key: 'otherInformation.cancerDetails.topography',
              isLeaf: true,
            },
            {
              title: 'morphology',
              key: 'otherInformation.cancerDetails.morphology',
              isLeaf: true,
            },
            {
              title: 'basisOfDiagnosis',
              key: 'otherInformation.cancerDetails.basisOfDiagnosis',
              isLeaf: true,
            },
            {
              title: 'stage',
              key: 'otherInformation.cancerDetails.stage',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'visitMainPaymentDetails',
      key: 'visitMainPaymentDetails',
      children: [
        {
          title: 'shortName',
          key: 'visitMainPaymentDetails.shortName',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'visitMainPaymentDetails.type',
          isLeaf: true,
        },
        {
          title: 'insuranceCode',
          key: 'visitMainPaymentDetails.insuranceCode',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'visitMainPaymentDetails.name',
          isLeaf: true,
        },
        {
          title: 'insuranceId',
          key: 'visitMainPaymentDetails.insuranceId',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'causesOfDeathDetails',
      key: 'causesOfDeathDetails',
      children: [
        {
          title: 'dateOfDeath',
          key: 'causesOfDeathDetails.dateOfDeath',
          isLeaf: true,
        },
        {
          title: 'lineA',
          key: 'causesOfDeathDetails.lineA',
          isLeaf: true,
        },
        {
          title: 'lineB',
          key: 'causesOfDeathDetails.lineB',
          isLeaf: true,
        },
        {
          title: 'lineC',
          key: 'causesOfDeathDetails.lineC',
          isLeaf: true,
        },
        {
          title: 'lineD',
          key: 'causesOfDeathDetails.lineD',
          isLeaf: true,
        },
        {
          title: 'causeOfDeathOther',
          key: 'causesOfDeathDetails.causeOfDeathOther',
          isLeaf: true,
        },
        {
          title: 'mannerOfDeath',
          key: 'causesOfDeathDetails.mannerOfDeath',
          isLeaf: true,
        },
        {
          title: 'placeOfDeath',
          key: 'causesOfDeathDetails.placeOfDeath',
          isLeaf: true,
        },
        {
          title: 'otherDeathDetails',
          key: 'causesOfDeathDetails.otherDeathDetails',
          children: [
            {
              title: 'postmortemDetails',
              key: 'causesOfDeathDetails.otherDeathDetails.postmortemDetails',
              isLeaf: true,
            },
            {
              title: 'marcerated',
              key: 'causesOfDeathDetails.otherDeathDetails.marcerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'causesOfDeathDetails.otherDeathDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'motherCondition',
              key: 'causesOfDeathDetails.otherDeathDetails.motherCondition',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'antenatalCareDetails',
      key: 'antenatalCareDetails',
      children: [
        {
          title: 'date',
          key: 'antenatalCareDetails.date',
          isLeaf: true,
        },
        {
          title: 'pregnancyAgeInWeeks',
          key: 'antenatalCareDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'lastAncVisitDate',
          key: 'antenatalCareDetails.lastAncVisitDate',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'antenatalCareDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'referredToCTC',
          key: 'antenatalCareDetails.referredToCTC',
          isLeaf: true,
        },
        {
          title: 'referredIn',
          key: 'antenatalCareDetails.referredIn',
          isLeaf: true,
        },
        {
          title: 'referredOut',
          key: 'antenatalCareDetails.referredOut',
          isLeaf: true,
        },
        {
          title: 'counselling',
          key: 'antenatalCareDetails.counselling',
          children: [
            {
              title: 'name',
              key: 'antenatalCareDetails.counselling.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.counselling.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'providedWithHivCounsellingBeforeLabTest',
          key: 'antenatalCareDetails.providedWithHivCounsellingBeforeLabTest',
          isLeaf: true,
        },
        {
          title: 'providedWithHivCounsellingAfterLabTest',
          key: 'antenatalCareDetails.providedWithHivCounsellingAfterLabTest',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'antenatalCareDetails.prophylaxis',
          children: [
            {
              title: 'providedWithLLIN',
              key: 'antenatalCareDetails.prophylaxis.providedWithLLIN',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT2',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT2',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT3',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT3',
              isLeaf: true,
            },
            {
              title: 'providedWithIPT4',
              key: 'antenatalCareDetails.prophylaxis.providedWithIPT4',
              isLeaf: true,
            },
            {
              title: 'providedWithIFFolic60Tablets',
              key: 'antenatalCareDetails.prophylaxis.providedWithIFFolic60Tablets',
              isLeaf: true,
            },
            {
              title: 'providedWithMebendazoleOrAlbendazole',
              key: 'antenatalCareDetails.prophylaxis.providedWithMebendazoleOrAlbendazole',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'hivDetails',
          key: 'antenatalCareDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'antenatalCareDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.hivDetails.code',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'antenatalCareDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'syphilisDetails',
          key: 'antenatalCareDetails.syphilisDetails',
          children: [
            {
              title: 'status',
              key: 'antenatalCareDetails.syphilisDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'antenatalCareDetails.syphilisDetails.code',
              isLeaf: true,
            },
            {
              title: 'providedWithTreatment',
              key: 'antenatalCareDetails.syphilisDetails.providedWithTreatment',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'diagnosedWithOtherSTDs',
          key: 'antenatalCareDetails.diagnosedWithOtherSTDs',
          isLeaf: true,
        },
        {
          title: 'providedWithTreatmentForOtherSTDs',
          key: 'antenatalCareDetails.providedWithTreatmentForOtherSTDs',
          isLeaf: true,
        },
        {
          title: 'gravidity',
          key: 'antenatalCareDetails.gravidity',
          isLeaf: true,
        },
        {
          title: 'spouseDetails',
          key: 'antenatalCareDetails.spouseDetails',
          children: [
            {
              title: 'hivDetails',
              key: 'antenatalCareDetails.spouseDetails.hivDetails',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'hivTestNumber',
                  key: 'antenatalCareDetails.spouseDetails.hivDetails.hivTestNumber',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'hepatitisB',
              key: 'antenatalCareDetails.spouseDetails.hepatitisB',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.code',
                  isLeaf: true,
                },
                {
                  title: 'providedWithTreatments',
                  key: 'antenatalCareDetails.spouseDetails.hepatitisB.providedWithTreatments',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'syphilisDetails',
              key: 'antenatalCareDetails.spouseDetails.syphilisDetails',
              children: [
                {
                  title: 'status',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'providedWithTreatment',
                  key: 'antenatalCareDetails.spouseDetails.syphilisDetails.providedWithTreatment',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'diagnosedWithOtherSTDs',
              key: 'antenatalCareDetails.spouseDetails.diagnosedWithOtherSTDs',
              isLeaf: true,
            },
            {
              title: 'providedWithTreatmentForOtherSTDs',
              key: 'antenatalCareDetails.spouseDetails.providedWithTreatmentForOtherSTDs',
              isLeaf: true,
            },
            {
              title: 'otherSpouseDetails',
              key: 'antenatalCareDetails.spouseDetails.otherSpouseDetails',
            },
          ],
        },
      ],
    },
    {
      title: 'laborAndDeliveryDetails',
      key: 'laborAndDeliveryDetails',
      children: [
        {
          title: 'date',
          key: 'laborAndDeliveryDetails.date',
          isLeaf: true,
        },
        {
          title: 'motherOrigin',
          key: 'laborAndDeliveryDetails.motherOrigin',
          isLeaf: true,
        },
        {
          title: 'hasComeWithSpouse',
          key: 'laborAndDeliveryDetails.hasComeWithSpouse',
          isLeaf: true,
        },
        {
          title: 'hasComeWithCompanion',
          key: 'laborAndDeliveryDetails.hasComeWithCompanion',
          isLeaf: true,
        },
        {
          title: 'pregnancyAgeInWeeks',
          key: 'laborAndDeliveryDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'wasProvidedWithAntenatalCorticosteroid',
          key: 'laborAndDeliveryDetails.wasProvidedWithAntenatalCorticosteroid',
          isLeaf: true,
        },
        {
          title: 'hasHistoryOfFGM',
          key: 'laborAndDeliveryDetails.hasHistoryOfFGM',
          isLeaf: true,
        },
        {
          title: 'hivDetails',
          key: 'laborAndDeliveryDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'laborAndDeliveryDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'laborAndDeliveryDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'laborAndDeliveryDetails.hivDetails.referredToCTC',
              isLeaf: true,
            },
            {
              title: 'ancHivStatus',
              key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus',
              children: [
                {
                  title: 'numberOfTestsTaken',
                  key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus.numberOfTestsTaken',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'laborAndDeliveryDetails.hivDetails.ancHivStatus.status',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'deliveryMethod',
          key: 'laborAndDeliveryDetails.deliveryMethod',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.deliveryMethod.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.deliveryMethod.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'placeOfBirth',
          key: 'laborAndDeliveryDetails.placeOfBirth',
          isLeaf: true,
        },
        {
          title: 'timeBetweenLaborPainAndDeliveryInHrs',
          key: 'laborAndDeliveryDetails.timeBetweenLaborPainAndDeliveryInHrs',
          isLeaf: true,
        },
        {
          title: 'isAttendantSkilled',
          key: 'laborAndDeliveryDetails.isAttendantSkilled',
          isLeaf: true,
        },
        {
          title: 'providedWithFamilyPlanningCounseling',
          key: 'laborAndDeliveryDetails.providedWithFamilyPlanningCounseling',
          isLeaf: true,
        },
        {
          title: 'providedWithInfantFeedingCounseling',
          key: 'laborAndDeliveryDetails.providedWithInfantFeedingCounseling',
          isLeaf: true,
        },
        {
          title: 'beforeBirthComplications',
          key: 'laborAndDeliveryDetails.beforeBirthComplications',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.beforeBirthComplications.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.beforeBirthComplications.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthComplications',
          key: 'laborAndDeliveryDetails.birthComplications',
          children: [
            {
              title: 'name',
              key: 'laborAndDeliveryDetails.birthComplications.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'laborAndDeliveryDetails.birthComplications.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthDetails',
          key: 'laborAndDeliveryDetails.birthDetails',
          children: [
            {
              title: 'dateOfBirth',
              key: 'laborAndDeliveryDetails.birthDetails.dateOfBirth',
              isLeaf: true,
            },
            {
              title: 'macerated',
              key: 'laborAndDeliveryDetails.birthDetails.macerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'laborAndDeliveryDetails.birthDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'bornWithDisabilities',
              key: 'laborAndDeliveryDetails.birthDetails.bornWithDisabilities',
              isLeaf: true,
            },
            {
              title: 'hivDnaPCRTested',
              key: 'laborAndDeliveryDetails.birthDetails.hivDnaPCRTested',
              isLeaf: true,
            },
            {
              title: 'childHivStatus',
              key: 'laborAndDeliveryDetails.birthDetails.childHivStatus',
              isLeaf: true,
            },
            {
              title: 'apgarScore',
              key: 'laborAndDeliveryDetails.birthDetails.apgarScore',
              children: [
                {
                  title: 'oneMinute',
                  key: 'laborAndDeliveryDetails.birthDetails.apgarScore.oneMinute',
                  isLeaf: true,
                },
                {
                  title: 'fiveMinute',
                  key: 'laborAndDeliveryDetails.birthDetails.apgarScore.fiveMinute',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'wasBreastFedWithinOneHourAfterDelivery',
              key: 'laborAndDeliveryDetails.birthDetails.wasBreastFedWithinOneHourAfterDelivery',
              isLeaf: true,
            },
            {
              title: 'weightInKgs',
              key: 'laborAndDeliveryDetails.birthDetails.weightInKgs',
              isLeaf: true,
            },
            {
              title: 'multipleBirth',
              key: 'laborAndDeliveryDetails.birthDetails.multipleBirth',
              isLeaf: true,
            },
            {
              title: 'motherAgeInYears',
              key: 'laborAndDeliveryDetails.birthDetails.motherAgeInYears',
              isLeaf: true,
            },
            {
              title: 'birthOrder',
              key: 'laborAndDeliveryDetails.birthDetails.birthOrder',
              isLeaf: true,
            },
            {
              title: 'exclusiveBreastFed',
              key: 'laborAndDeliveryDetails.birthDetails.exclusiveBreastFed',
              isLeaf: true,
            },
            {
              title: 'motherHivStatus',
              key: 'laborAndDeliveryDetails.birthDetails.motherHivStatus',
              isLeaf: true,
            },
            {
              title: 'providedWithARV',
              key: 'laborAndDeliveryDetails.birthDetails.providedWithARV',
              isLeaf: true,
            },
            {
              title: 'outcomeDetails',
              key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails',
              children: [
                {
                  title: 'isAlive',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.isAlive',
                  isLeaf: true,
                },
                {
                  title: 'referredToPNC',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredToPNC',
                  isLeaf: true,
                },
                {
                  title: 'referredToHospital',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredToHospital',
                  isLeaf: true,
                },
                {
                  title: 'referredTohealthFacility',
                  key: 'laborAndDeliveryDetails.birthDetails.outcomeDetails.referredTohealthFacility',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'vaccinationDetails',
              key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails',
              children: [
                {
                  title: 'code',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'date',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.date',
                  isLeaf: true,
                },
                {
                  title: 'type',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.type',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.name',
                  isLeaf: true,
                },
                {
                  title: 'vaccinationModality',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.vaccinationModality',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.notes',
                  isLeaf: true,
                },
                {
                  title: 'dosage',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.dosage',
                  isLeaf: true,
                },
                {
                  title: 'reaction',
                  key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction',
                  children: [
                    {
                      title: 'reactionDate',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.reactionDate',
                      isLeaf: true,
                    },
                    {
                      title: 'notes',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.notes',
                      isLeaf: true,
                    },
                    {
                      title: 'reported',
                      key: 'laborAndDeliveryDetails.birthDetails.vaccinationDetails.reaction.reported',
                      isLeaf: true,
                    },
                  ],
                },
              ],
            },
            {
              title: 'methodOfResuscitation',
              key: 'laborAndDeliveryDetails.birthDetails.methodOfResuscitation',
              isLeaf: true,
            },
            {
              title: 'otherServices',
              key: 'laborAndDeliveryDetails.birthDetails.otherServices',
            },
          ],
        },
        {
          title: 'others',
          key: 'laborAndDeliveryDetails.others',
          children: [
            {
              title: 'emoc',
              key: 'laborAndDeliveryDetails.others.emoc',
              children: [
                {
                  title: 'providedAntibiotic',
                  key: 'laborAndDeliveryDetails.others.emoc.providedAntibiotic',
                  isLeaf: true,
                },
                {
                  title: 'providedUterotonic',
                  key: 'laborAndDeliveryDetails.others.emoc.providedUterotonic',
                  isLeaf: true,
                },
                {
                  title: 'providedMagnesiumSulphate',
                  key: 'laborAndDeliveryDetails.others.emoc.providedMagnesiumSulphate',
                  isLeaf: true,
                },
                {
                  title: 'removedPlacenta',
                  key: 'laborAndDeliveryDetails.others.emoc.removedPlacenta',
                  isLeaf: true,
                },
                {
                  title: 'performedMvaOrDc',
                  key: 'laborAndDeliveryDetails.others.emoc.performedMvaOrDc',
                  isLeaf: true,
                },
                {
                  title: 'administeredBlood',
                  key: 'laborAndDeliveryDetails.others.emoc.administeredBlood',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'amstl',
              key: 'laborAndDeliveryDetails.others.amstl',
              children: [
                {
                  title: 'cordTractionUsed',
                  key: 'laborAndDeliveryDetails.others.amstl.cordTractionUsed',
                  isLeaf: true,
                },
                {
                  title: 'uterineMassageDone',
                  key: 'laborAndDeliveryDetails.others.amstl.uterineMassageDone',
                  isLeaf: true,
                },
                {
                  title: 'administeredOxytocin',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredOxytocin',
                  isLeaf: true,
                },
                {
                  title: 'administeredEgometrine',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredEgometrine',
                  isLeaf: true,
                },
                {
                  title: 'administeredMisoprostol',
                  key: 'laborAndDeliveryDetails.others.amstl.administeredMisoprostol',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'familyPlanning',
              key: 'laborAndDeliveryDetails.others.familyPlanning',
            },
          ],
        },
      ],
    },
    {
      title: 'vaccinationDetails',
      key: 'vaccinationDetails',
      children: [
        {
          title: 'code',
          key: 'vaccinationDetails.code',
          isLeaf: true,
        },
        {
          title: 'date',
          key: 'vaccinationDetails.date',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'vaccinationDetails.type',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'vaccinationDetails.name',
          isLeaf: true,
        },
        {
          title: 'vaccinationModality',
          key: 'vaccinationDetails.vaccinationModality',
          isLeaf: true,
        },
        {
          title: 'status',
          key: 'vaccinationDetails.status',
          isLeaf: true,
        },
        {
          title: 'notes',
          key: 'vaccinationDetails.notes',
          isLeaf: true,
        },
        {
          title: 'dosage',
          key: 'vaccinationDetails.dosage',
          isLeaf: true,
        },
        {
          title: 'reaction',
          key: 'vaccinationDetails.reaction',
          children: [
            {
              title: 'reactionDate',
              key: 'vaccinationDetails.reaction.reactionDate',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'vaccinationDetails.reaction.notes',
              isLeaf: true,
            },
            {
              title: 'reported',
              key: 'vaccinationDetails.reaction.reported',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'prophylAxisDetails',
      key: 'prophylAxisDetails',
      children: [
        {
          title: 'code',
          key: 'prophylAxisDetails.code',
          isLeaf: true,
        },
        {
          title: 'date',
          key: 'prophylAxisDetails.date',
          isLeaf: true,
        },
        {
          title: 'type',
          key: 'prophylAxisDetails.type',
          isLeaf: true,
        },
        {
          title: 'name',
          key: 'prophylAxisDetails.name',
          isLeaf: true,
        },
        {
          title: 'status',
          key: 'prophylAxisDetails.status',
          isLeaf: true,
        },
        {
          title: 'notes',
          key: 'prophylAxisDetails.notes',
          isLeaf: true,
        },
        {
          title: 'reaction',
          key: 'prophylAxisDetails.reaction',
          children: [
            {
              title: 'reactionDate',
              key: 'prophylAxisDetails.reaction.reactionDate',
              isLeaf: true,
            },
            {
              title: 'notes',
              key: 'prophylAxisDetails.reaction.notes',
              isLeaf: true,
            },
            {
              title: 'reported',
              key: 'prophylAxisDetails.reaction.reported',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'familyPlanningDetails',
      key: 'familyPlanningDetails',
      children: [
        {
          title: 'date',
          key: 'familyPlanningDetails.date',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'familyPlanningDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'wasCounselled',
          key: 'familyPlanningDetails.wasCounselled',
          isLeaf: true,
        },
        {
          title: 'hasComeWithSpouse',
          key: 'familyPlanningDetails.hasComeWithSpouse',
          isLeaf: true,
        },
        {
          title: 'serviceLocation',
          key: 'familyPlanningDetails.serviceLocation',
          isLeaf: true,
        },
        {
          title: 'referred',
          key: 'familyPlanningDetails.referred',
          isLeaf: true,
        },
        {
          title: 'cancerScreeningDetails',
          key: 'familyPlanningDetails.cancerScreeningDetails',
          children: [
            {
              title: 'breastCancer',
              key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer',
              children: [
                {
                  title: 'foundWithBreastCancerSymptoms',
                  key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms',
                  isLeaf: true,
                },
                {
                  title: 'screened',
                  key: 'familyPlanningDetails.cancerScreeningDetails.breastCancer.screened',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'cervicalCancer',
              key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer',
              children: [
                {
                  title: 'suspected',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.suspected',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithVIA',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.screenedWithVIA',
                  isLeaf: true,
                },
                {
                  title: 'viaTestPositive',
                  key: 'familyPlanningDetails.cancerScreeningDetails.cervicalCancer.viaTestPositive',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
        {
          title: 'hivStatus',
          key: 'familyPlanningDetails.hivStatus',
          children: [
            {
              title: 'status',
              key: 'familyPlanningDetails.hivStatus.status',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'familyPlanningDetails.hivStatus.referredToCTC',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'spouseHivStatus',
          key: 'familyPlanningDetails.spouseHivStatus',
          children: [
            {
              title: 'status',
              key: 'familyPlanningDetails.spouseHivStatus.status',
              isLeaf: true,
            },
            {
              title: 'referredToCTC',
              key: 'familyPlanningDetails.spouseHivStatus.referredToCTC',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'breastFeeding',
          key: 'familyPlanningDetails.breastFeeding',
          isLeaf: true,
        },
        {
          title: 'sideEffects',
          key: 'familyPlanningDetails.sideEffects',
          children: [
            {
              title: 'bleeding',
              key: 'familyPlanningDetails.sideEffects.bleeding',
              isLeaf: true,
            },
            {
              title: 'headache',
              key: 'familyPlanningDetails.sideEffects.headache',
              isLeaf: true,
            },
            {
              title: 'gotPregnancy',
              key: 'familyPlanningDetails.sideEffects.gotPregnancy',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'childHealthDetails',
      key: 'childHealthDetails',
      children: [
        {
          title: 'serviceModality',
          key: 'childHealthDetails.serviceModality',
          isLeaf: true,
        },
        {
          title: 'motherAge',
          key: 'childHealthDetails.motherAge',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'childHealthDetails.prophylaxis',
          children: [
            {
              title: 'albendazole',
              key: 'childHealthDetails.prophylaxis.albendazole',
              children: [
                {
                  title: 'administered',
                  key: 'childHealthDetails.prophylaxis.albendazole.administered',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'vitaminA',
              key: 'childHealthDetails.prophylaxis.vitaminA',
              children: [
                {
                  title: 'administered',
                  key: 'childHealthDetails.prophylaxis.vitaminA.administered',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'providedWithLLIN',
              key: 'childHealthDetails.prophylaxis.providedWithLLIN',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'infantFeeding',
          key: 'childHealthDetails.infantFeeding',
          isLeaf: true,
        },
        {
          title: 'providedWithInfantFeedingCounselling',
          key: 'childHealthDetails.providedWithInfantFeedingCounselling',
          isLeaf: true,
        },
        {
          title: 'hasBeenBreastFedFor24Month',
          key: 'childHealthDetails.hasBeenBreastFedFor24Month',
          isLeaf: true,
        },
        {
          title: 'motherHivStatus',
          key: 'childHealthDetails.motherHivStatus',
          children: [
            {
              title: 'status',
              key: 'childHealthDetails.motherHivStatus.status',
              isLeaf: true,
            },
            {
              title: 'testingDate',
              key: 'childHealthDetails.motherHivStatus.testingDate',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referredToCTC',
          key: 'childHealthDetails.referredToCTC',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'cpacDetails',
      key: 'cpacDetails',
      children: [
        {
          title: 'pregnancyAgeInWeeks',
          key: 'cpacDetails.pregnancyAgeInWeeks',
          isLeaf: true,
        },
        {
          title: 'causeOfAbortion',
          key: 'cpacDetails.causeOfAbortion',
          isLeaf: true,
        },
        {
          title: 'afterAbortionServices',
          key: 'cpacDetails.afterAbortionServices',
          isLeaf: true,
        },
        {
          title: 'positiveHIVStatusBeforeAbortion',
          key: 'cpacDetails.positiveHIVStatusBeforeAbortion',
          isLeaf: true,
        },
        {
          title: 'hivTest',
          key: 'cpacDetails.hivTest',
          children: [
            {
              title: 'status',
              key: 'cpacDetails.hivTest.status',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referReason',
          key: 'cpacDetails.referReason',
          isLeaf: true,
        },
        {
          title: 'postAbortionsMedications',
          key: 'cpacDetails.postAbortionsMedications',
          children: [
            {
              title: 'providedWithAntibiotics',
              key: 'cpacDetails.postAbortionsMedications.providedWithAntibiotics',
              isLeaf: true,
            },
            {
              title: 'providedWithPainKillers',
              key: 'cpacDetails.postAbortionsMedications.providedWithPainKillers',
              isLeaf: true,
            },
            {
              title: 'providedWithOxytocin',
              key: 'cpacDetails.postAbortionsMedications.providedWithOxytocin',
              isLeaf: true,
            },
            {
              title: 'providedWithMisoprostol',
              key: 'cpacDetails.postAbortionsMedications.providedWithMisoprostol',
              isLeaf: true,
            },
            {
              title: 'providedWithIvInfusion',
              key: 'cpacDetails.postAbortionsMedications.providedWithIvInfusion',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'postAbortionCounselling',
          key: 'cpacDetails.postAbortionCounselling',
          children: [
            {
              title: 'providedWithSTDsPreventionCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithSTDsPreventionCounselling',
              isLeaf: true,
            },
            {
              title: 'providedWithHIVCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithHIVCounselling',
              isLeaf: true,
            },
            {
              title: 'providedWithFamilyPlanningCounselling',
              key: 'cpacDetails.postAbortionCounselling.providedWithFamilyPlanningCounselling',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'contraceptives',
          key: 'cpacDetails.contraceptives',
          children: [
            {
              title: 'didReceiveOralPillsPOP',
              key: 'cpacDetails.contraceptives.didReceiveOralPillsPOP',
              isLeaf: true,
            },
            {
              title: 'popCyclesProvided',
              key: 'cpacDetails.contraceptives.popCyclesProvided',
              isLeaf: true,
            },
            {
              title: 'didReceiveOralPillsCOC',
              key: 'cpacDetails.contraceptives.didReceiveOralPillsCOC',
              isLeaf: true,
            },
            {
              title: 'cocCyclesProvided',
              key: 'cpacDetails.contraceptives.cocCyclesProvided',
              isLeaf: true,
            },
            {
              title: 'didReceivePillCycles',
              key: 'cpacDetails.contraceptives.didReceivePillCycles',
              isLeaf: true,
            },
            {
              title: 'wasInsertedWithImplanon',
              key: 'cpacDetails.contraceptives.wasInsertedWithImplanon',
              isLeaf: true,
            },
            {
              title: 'wasInsertedWithJadelle',
              key: 'cpacDetails.contraceptives.wasInsertedWithJadelle',
              isLeaf: true,
            },
            {
              title: 'didReceiveIUD',
              key: 'cpacDetails.contraceptives.didReceiveIUD',
              isLeaf: true,
            },
            {
              title: 'didHaveTubalLigation',
              key: 'cpacDetails.contraceptives.didHaveTubalLigation',
              isLeaf: true,
            },
            {
              title: 'didReceiveInjection',
              key: 'cpacDetails.contraceptives.didReceiveInjection',
              isLeaf: true,
            },
            {
              title: 'numberOfFemaleCondomsProvided',
              key: 'cpacDetails.contraceptives.numberOfFemaleCondomsProvided',
              isLeaf: true,
            },
            {
              title: 'numberOfMaleCondomsProvided',
              key: 'cpacDetails.contraceptives.numberOfMaleCondomsProvided',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'cecap',
      key: 'cecap',
      children: [
        {
          title: 'cancerScreeningDetails',
          key: 'cecap.cancerScreeningDetails',
          children: [
            {
              title: 'breastCancer',
              key: 'cecap.cancerScreeningDetails.breastCancer',
              children: [
                {
                  title: 'foundWithBreastCancerSymptoms',
                  key: 'cecap.cancerScreeningDetails.breastCancer.foundWithBreastCancerSymptoms',
                  isLeaf: true,
                },
                {
                  title: 'screened',
                  key: 'cecap.cancerScreeningDetails.breastCancer.screened',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'cervicalCancer',
              key: 'cecap.cancerScreeningDetails.cervicalCancer',
              children: [
                {
                  title: 'suspected',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.suspected',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithVIA',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.screenedWithVIA',
                  isLeaf: true,
                },
                {
                  title: 'screenedWithHPVDNA',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.screenedWithHPVDNA',
                  isLeaf: true,
                },
                {
                  title: 'viaTestPositive',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.viaTestPositive',
                  isLeaf: true,
                },
                {
                  title: 'hpvDNAPositive',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.hpvDNAPositive',
                  isLeaf: true,
                },
                {
                  title: 'diagnosedWithLargeLesion',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.diagnosedWithLargeLesion',
                  isLeaf: true,
                },
                {
                  title: 'diagnosedWithSmallOrModerateLesion',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.diagnosedWithSmallOrModerateLesion',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithCryo',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithCryo',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithThermo',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithThermo',
                  isLeaf: true,
                },
                {
                  title: 'treatedWithLEEP',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedWithLEEP',
                  isLeaf: true,
                },
                {
                  title: 'firstTimeScreening',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.firstTimeScreening',
                  isLeaf: true,
                },
                {
                  title: 'treatedOnTheSameDay',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.treatedOnTheSameDay',
                  isLeaf: true,
                },
                {
                  title: 'complicationsAfterTreatment',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.complicationsAfterTreatment',
                  isLeaf: true,
                },
                {
                  title: 'foundWithHivAndReferredToCTC',
                  key: 'cecap.cancerScreeningDetails.cervicalCancer.foundWithHivAndReferredToCTC',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: 'postnatalDetails',
      key: 'postnatalDetails',
      children: [
        {
          title: 'date',
          key: 'postnatalDetails.date',
          isLeaf: true,
        },
        {
          title: 'positiveHivStatusBeforeService',
          key: 'postnatalDetails.positiveHivStatusBeforeService',
          isLeaf: true,
        },
        {
          title: 'hivStatusAsSeenFromAncCard',
          key: 'postnatalDetails.hivStatusAsSeenFromAncCard',
          isLeaf: true,
        },
        {
          title: 'hivDetails',
          key: 'postnatalDetails.hivDetails',
          children: [
            {
              title: 'status',
              key: 'postnatalDetails.hivDetails.status',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.hivDetails.code',
              isLeaf: true,
            },
            {
              title: 'hivTestNumber',
              key: 'postnatalDetails.hivDetails.hivTestNumber',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'motherAndChildOrigin',
          key: 'postnatalDetails.motherAndChildOrigin',
          isLeaf: true,
        },
        {
          title: 'referredToCTC',
          key: 'postnatalDetails.referredToCTC',
          isLeaf: true,
        },
        {
          title: 'placeOfBirth',
          key: 'postnatalDetails.placeOfBirth',
          isLeaf: true,
        },
        {
          title: 'prophylaxis',
          key: 'postnatalDetails.prophylaxis',
          children: [
            {
              title: 'providedWithAntenatalCorticosteroids',
              key: 'postnatalDetails.prophylaxis.providedWithAntenatalCorticosteroids',
              isLeaf: true,
            },
            {
              title: 'provideWithVitaminA',
              key: 'postnatalDetails.prophylaxis.provideWithVitaminA',
              isLeaf: true,
            },
            {
              title: 'providedWithFEFO',
              key: 'postnatalDetails.prophylaxis.providedWithFEFO',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'counselling',
          key: 'postnatalDetails.counselling',
          children: [
            {
              title: 'name',
              key: 'postnatalDetails.counselling.name',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.counselling.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referredToClinicForFurtherServices',
          key: 'postnatalDetails.referredToClinicForFurtherServices',
          isLeaf: true,
        },
        {
          title: 'outCome',
          key: 'postnatalDetails.outCome',
          isLeaf: true,
        },
        {
          title: 'APGARScore',
          key: 'postnatalDetails.APGARScore',
          isLeaf: true,
        },
        {
          title: 'demagedNipples',
          key: 'postnatalDetails.demagedNipples',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.demagedNipples.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.demagedNipples.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'mastitis',
          key: 'postnatalDetails.mastitis',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.mastitis.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.mastitis.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'breastAbscess',
          key: 'postnatalDetails.breastAbscess',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.breastAbscess.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.breastAbscess.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'fistula',
          key: 'postnatalDetails.fistula',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.fistula.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.fistula.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'puerperalPsychosis',
          key: 'postnatalDetails.puerperalPsychosis',
          children: [
            {
              title: 'provided',
              key: 'postnatalDetails.puerperalPsychosis.provided',
              isLeaf: true,
            },
            {
              title: 'code',
              key: 'postnatalDetails.puerperalPsychosis.code',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'daysSinceDelivery',
          key: 'postnatalDetails.daysSinceDelivery',
          isLeaf: true,
        },
        {
          title: 'breastFeedingDetails',
          key: 'postnatalDetails.breastFeedingDetails',
          isLeaf: true,
        },
        {
          title: 'neonatalDeathDetails',
          key: 'postnatalDetails.neonatalDeathDetails',
          children: [
            {
              title: 'dateOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.dateOfDeath',
              isLeaf: true,
            },
            {
              title: 'lineA',
              key: 'postnatalDetails.neonatalDeathDetails.lineA',
              isLeaf: true,
            },
            {
              title: 'lineB',
              key: 'postnatalDetails.neonatalDeathDetails.lineB',
              isLeaf: true,
            },
            {
              title: 'lineC',
              key: 'postnatalDetails.neonatalDeathDetails.lineC',
              isLeaf: true,
            },
            {
              title: 'lineD',
              key: 'postnatalDetails.neonatalDeathDetails.lineD',
              isLeaf: true,
            },
            {
              title: 'causeOfDeathOther',
              key: 'postnatalDetails.neonatalDeathDetails.causeOfDeathOther',
              isLeaf: true,
            },
            {
              title: 'mannerOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.mannerOfDeath',
              isLeaf: true,
            },
            {
              title: 'placeOfDeath',
              key: 'postnatalDetails.neonatalDeathDetails.placeOfDeath',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'birthDetails',
          key: 'postnatalDetails.birthDetails',
          children: [
            {
              title: 'dateOfBirth',
              key: 'postnatalDetails.birthDetails.dateOfBirth',
              isLeaf: true,
            },
            {
              title: 'weightInKgs',
              key: 'postnatalDetails.birthDetails.weightInKgs',
              isLeaf: true,
            },
            {
              title: 'multipleBirth',
              key: 'postnatalDetails.birthDetails.multipleBirth',
              isLeaf: true,
            },
            {
              title: 'birthOrder',
              key: 'postnatalDetails.birthDetails.birthOrder',
              isLeaf: true,
            },
            {
              title: 'infantFeeding',
              key: 'postnatalDetails.birthDetails.infantFeeding',
              isLeaf: true,
            },
            {
              title: 'gender',
              key: 'postnatalDetails.birthDetails.gender',
              isLeaf: true,
            },
            {
              title: 'macerated',
              key: 'postnatalDetails.birthDetails.macerated',
              isLeaf: true,
            },
            {
              title: 'fresh',
              key: 'postnatalDetails.birthDetails.fresh',
              isLeaf: true,
            },
            {
              title: 'providedWithKmc',
              key: 'postnatalDetails.birthDetails.providedWithKmc',
              isLeaf: true,
            },
            {
              title: 'hb',
              key: 'postnatalDetails.birthDetails.hb',
              isLeaf: true,
            },
            {
              title: 'hbigTested',
              key: 'postnatalDetails.birthDetails.hbigTested',
              isLeaf: true,
            },
            {
              title: 'hivDnaPCRTested',
              key: 'postnatalDetails.birthDetails.hivDnaPCRTested',
              isLeaf: true,
            },
            {
              title: 'childHivStatus',
              key: 'postnatalDetails.birthDetails.childHivStatus',
              isLeaf: true,
            },
            {
              title: 'infections',
              key: 'postnatalDetails.birthDetails.infections',
              children: [
                {
                  title: 'hasSepticaemia',
                  key: 'postnatalDetails.birthDetails.infections.hasSepticaemia',
                  isLeaf: true,
                },
                {
                  title: 'hasOmphalitis',
                  key: 'postnatalDetails.birthDetails.infections.hasOmphalitis',
                  isLeaf: true,
                },
                {
                  title: 'hasSkinInfection',
                  key: 'postnatalDetails.birthDetails.infections.hasSkinInfection',
                  isLeaf: true,
                },
                {
                  title: 'hasOcularInfection',
                  key: 'postnatalDetails.birthDetails.infections.hasOcularInfection',
                  isLeaf: true,
                },
                {
                  title: 'hasJaundice',
                  key: 'postnatalDetails.birthDetails.infections.hasJaundice',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'outcomeDetails',
              key: 'postnatalDetails.birthDetails.outcomeDetails',
              children: [
                {
                  title: 'dischargedHome',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.dischargedHome',
                  isLeaf: true,
                },
                {
                  title: 'referredToNCU',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToNCU',
                  isLeaf: true,
                },
                {
                  title: 'referredToHospital',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToHospital',
                  isLeaf: true,
                },
                {
                  title: 'referredToHealthFacility',
                  key: 'postnatalDetails.birthDetails.outcomeDetails.referredToHealthFacility',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'motherHivStatus',
              key: 'postnatalDetails.birthDetails.motherHivStatus',
              children: [
                {
                  title: 'name',
                  key: 'postnatalDetails.birthDetails.motherHivStatus.name',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.motherHivStatus.code',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'providedWithARV',
              key: 'postnatalDetails.birthDetails.providedWithARV',
              isLeaf: true,
            },
            {
              title: 'referred',
              key: 'postnatalDetails.birthDetails.referred',
              isLeaf: true,
            },
            {
              title: 'vaccinationDetails',
              key: 'postnatalDetails.birthDetails.vaccinationDetails',
              children: [
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.code',
                  isLeaf: true,
                },
                {
                  title: 'date',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.date',
                  isLeaf: true,
                },
                {
                  title: 'type',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.type',
                  isLeaf: true,
                },
                {
                  title: 'name',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.name',
                  isLeaf: true,
                },
                {
                  title: 'vaccinationModality',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.vaccinationModality',
                  isLeaf: true,
                },
                {
                  title: 'status',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.status',
                  isLeaf: true,
                },
                {
                  title: 'notes',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.notes',
                  isLeaf: true,
                },
                {
                  title: 'dosage',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.dosage',
                  isLeaf: true,
                },
                {
                  title: 'reaction',
                  key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction',
                  children: [
                    {
                      title: 'reactionDate',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.reactionDate',
                      isLeaf: true,
                    },
                    {
                      title: 'notes',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.notes',
                      isLeaf: true,
                    },
                    {
                      title: 'reported',
                      key: 'postnatalDetails.birthDetails.vaccinationDetails.reaction.reported',
                      isLeaf: true,
                    },
                  ],
                },
              ],
            },
            {
              title: 'breatheAssistance',
              key: 'postnatalDetails.birthDetails.breatheAssistance',
              children: [
                {
                  title: 'provided',
                  key: 'postnatalDetails.birthDetails.breatheAssistance.provided',
                  isLeaf: true,
                },
                {
                  title: 'code',
                  key: 'postnatalDetails.birthDetails.breatheAssistance.code',
                  isLeaf: true,
                },
              ],
            },
            {
              title: 'otherServices',
              key: 'postnatalDetails.birthDetails.otherServices',
            },
          ],
        },
        {
          title: 'otherServices',
          key: 'postnatalDetails.otherServices',
        },
      ],
    },
    {
      title: 'billingsDetails',
      key: 'billingsDetails',
      children: [
        {
          title: 'billID',
          key: 'billingsDetails.billID',
          isLeaf: true,
        },
        {
          title: 'billingCode',
          key: 'billingsDetails.billingCode',
          isLeaf: true,
        },
        {
          title: 'billType',
          key: 'billingsDetails.billType',
          isLeaf: true,
        },
        {
          title: 'insuranceCode',
          key: 'billingsDetails.insuranceCode',
          isLeaf: true,
        },
        {
          title: 'insuranceName',
          key: 'billingsDetails.insuranceName',
          isLeaf: true,
        },
        {
          title: 'amountBilled',
          key: 'billingsDetails.amountBilled',
          isLeaf: true,
        },
        {
          title: 'exemptionType',
          key: 'billingsDetails.exemptionType',
          isLeaf: true,
        },
        {
          title: 'wavedAmount',
          key: 'billingsDetails.wavedAmount',
          isLeaf: true,
        },
        {
          title: 'billDate',
          key: 'billingsDetails.billDate',
          isLeaf: true,
        },
        {
          title: 'standardCode',
          key: 'billingsDetails.standardCode',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'referralDetails',
      key: 'referralDetails',
      children: [
        {
          title: 'referralDate',
          key: 'referralDetails.referralDate',
          isLeaf: true,
        },
        {
          title: 'referredToOtherCountry',
          key: 'referralDetails.referredToOtherCountry',
          isLeaf: true,
        },
        {
          title: 'reason',
          key: 'referralDetails.reason',
          children: [
            {
              title: '0',
              key: 'referralDetails.reason.0',
              isLeaf: true,
            },
            {
              title: '1',
              key: 'referralDetails.reason.1',
              isLeaf: true,
            },
            {
              title: '2',
              key: 'referralDetails.reason.2',
              isLeaf: true,
            },
            {
              title: '3',
              key: 'referralDetails.reason.3',
              isLeaf: true,
            },
            {
              title: '4',
              key: 'referralDetails.reason.4',
              isLeaf: true,
            },
            {
              title: '5',
              key: 'referralDetails.reason.5',
              isLeaf: true,
            },
            {
              title: '6',
              key: 'referralDetails.reason.6',
              isLeaf: true,
            },
            {
              title: '7',
              key: 'referralDetails.reason.7',
              isLeaf: true,
            },
            {
              title: '8',
              key: 'referralDetails.reason.8',
              isLeaf: true,
            },
            {
              title: '9',
              key: 'referralDetails.reason.9',
              isLeaf: true,
            },
            {
              title: '10',
              key: 'referralDetails.reason.10',
              isLeaf: true,
            },
            {
              title: '11',
              key: 'referralDetails.reason.11',
              isLeaf: true,
            },
            {
              title: '12',
              key: 'referralDetails.reason.12',
              isLeaf: true,
            },
            {
              title: '13',
              key: 'referralDetails.reason.13',
              isLeaf: true,
            },
            {
              title: '14',
              key: 'referralDetails.reason.14',
              isLeaf: true,
            },
            {
              title: '15',
              key: 'referralDetails.reason.15',
              isLeaf: true,
            },
            {
              title: '16',
              key: 'referralDetails.reason.16',
              isLeaf: true,
            },
            {
              title: '17',
              key: 'referralDetails.reason.17',
              isLeaf: true,
            },
            {
              title: '18',
              key: 'referralDetails.reason.18',
              isLeaf: true,
            },
            {
              title: '19',
              key: 'referralDetails.reason.19',
              isLeaf: true,
            },
            {
              title: '20',
              key: 'referralDetails.reason.20',
              isLeaf: true,
            },
            {
              title: '21',
              key: 'referralDetails.reason.21',
              isLeaf: true,
            },
            {
              title: '22',
              key: 'referralDetails.reason.22',
              isLeaf: true,
            },
            {
              title: '23',
              key: 'referralDetails.reason.23',
              isLeaf: true,
            },
            {
              title: '24',
              key: 'referralDetails.reason.24',
              isLeaf: true,
            },
            {
              title: '25',
              key: 'referralDetails.reason.25',
              isLeaf: true,
            },
            {
              title: '26',
              key: 'referralDetails.reason.26',
              isLeaf: true,
            },
            {
              title: '27',
              key: 'referralDetails.reason.27',
              isLeaf: true,
            },
          ],
        },
        {
          title: 'referralNumber',
          key: 'referralDetails.referralNumber',
          isLeaf: true,
        },
        {
          title: 'hfrCode',
          key: 'referralDetails.hfrCode',
          isLeaf: true,
        },
        {
          title: 'referringClinician',
          key: 'referralDetails.referringClinician',
          children: [
            {
              title: 'name',
              key: 'referralDetails.referringClinician.name',
              isLeaf: true,
            },
            {
              title: 'phoneNumber',
              key: 'referralDetails.referringClinician.phoneNumber',
              isLeaf: true,
            },
            {
              title: 'MCTCode',
              key: 'referralDetails.referringClinician.MCTCode',
              isLeaf: true,
            },
          ],
        },
      ],
    },
    {
      title: 'contraceptives',
      key: 'contraceptives',
      children: [
        {
          title: 'popCyclesProvided',
          key: 'contraceptives.popCyclesProvided',
          isLeaf: true,
        },
        {
          title: 'cocCyclesProvided',
          key: 'contraceptives.cocCyclesProvided',
          isLeaf: true,
        },
        {
          title: 'didReceiveSDM',
          key: 'contraceptives.didReceiveSDM',
          isLeaf: true,
        },
        {
          title: 'didUseLAM',
          key: 'contraceptives.didUseLAM',
          isLeaf: true,
        },
        {
          title: 'didOptToUseEmergencyMethods',
          key: 'contraceptives.didOptToUseEmergencyMethods',
          isLeaf: true,
        },
        {
          title: 'wasInsertedWithImplanon',
          key: 'contraceptives.wasInsertedWithImplanon',
          isLeaf: true,
        },
        {
          title: 'wasInsertedWithJadelle',
          key: 'contraceptives.wasInsertedWithJadelle',
          isLeaf: true,
        },
        {
          title: 'didRemoveImplanon',
          key: 'contraceptives.didRemoveImplanon',
          isLeaf: true,
        },
        {
          title: 'didRemoveJadelle',
          key: 'contraceptives.didRemoveJadelle',
          isLeaf: true,
        },
        {
          title: 'didReceiveIUD',
          key: 'contraceptives.didReceiveIUD',
          isLeaf: true,
        },
        {
          title: 'didRemoveIUD',
          key: 'contraceptives.didRemoveIUD',
          isLeaf: true,
        },
        {
          title: 'didHaveTubalLigation',
          key: 'contraceptives.didHaveTubalLigation',
          isLeaf: true,
        },
        {
          title: 'didHaveVasectomy',
          key: 'contraceptives.didHaveVasectomy',
          isLeaf: true,
        },
        {
          title: 'didReceiveInjection',
          key: 'contraceptives.didReceiveInjection',
          isLeaf: true,
        },
        {
          title: 'numberOfFemaleCondomsProvided',
          key: 'contraceptives.numberOfFemaleCondomsProvided',
          isLeaf: true,
        },
        {
          title: 'numberOfMaleCondomsProvided',
          key: 'contraceptives.numberOfMaleCondomsProvided',
          isLeaf: true,
        },
      ],
    },
  ];

  // Expose our data model and operators to the template
  fields: any = DATA_MODEL_DEFINITION;
  operators = OPERATORS;
  treeData: any = {
    title: 'key',
    expanded: true,
    children: [],
    isLeaf: false,
  };

  // ControlValueAccessor methods
  @Output() valueChange = new EventEmitter<string>();

  onTouched: () => void = () => {};

  constructor() {}

  ngOnInit(): void {
    // this.treeData = transformFieldsToTreeNodes(DATA_MODEL_DEFINITION);

    // Start with one empty group
    if (this.groups.length === 0) {
      this.addGroup();
    }
  }

  addGroup(): void {
    this.groups.push({
      conditions: [{}], // Start with one empty condition
    });
    this.updateRule();
  }

  removeGroup(groupIndex: number): void {
    this.groups.splice(groupIndex, 1);
    this.updateRule();
  }

  addCondition(group: RuleGroup): void {
    group.conditions.push({});
    this.updateRule();
  }

  removeCondition(group: RuleGroup, conditionIndex: number): void {
    group.conditions.splice(conditionIndex, 1);
    if (group.conditions.length === 0 && this.groups.length > 1) {
      const groupIndex = this.groups.indexOf(group);
      this.removeGroup(groupIndex);
    }
    this.updateRule();
  }

  // --- Core Logic ---
  updateRule(): void {
    const groupStrings = this.groups
      .map((group) => {
        const conditionStrings = group.conditions
          .map((cond) => {
            if (
              cond.leftOperandPath &&
              cond.operator &&
              cond.rightOperandPath
            ) {
              return `${cond.leftOperandPath} ${cond.operator} ${cond.rightOperandPath}`;
            }
            return null;
          })
          .filter((c) => c !== null);

        if (conditionStrings.length === 0) {
          return null;
        }
        return `(${conditionStrings.join(' && ')})`;
      })
      .filter((g) => g !== null);

    const finalExpression = groupStrings.join(' || ');
    this.valueChange.emit(finalExpression);
    this.onTouched(); // Also a good idea to call onTouched when the value changes
  }

  // --- ControlValueAccessor Implementation ---
  writeValue(value: any): void {
    // For this example, we start fresh. A production app would parse the value.
    if (!value) {
      this.groups = [];
      this.addGroup();
    }
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleSelectionChange(selectedKeys: string[] | null): void {
    console.log('Event received from child component:', selectedKeys);
    this.currentSelection = selectedKeys;
  }
}
