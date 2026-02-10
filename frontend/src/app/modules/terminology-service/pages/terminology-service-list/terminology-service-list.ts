import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZORRO_MODULES } from '@hdu/shared';

interface TerminologyCode {
  id: string;
  name: string;
  code: string;
}

const mockICD10Codes: TerminologyCode[] = [
  { id: '1', name: 'Malignant neoplasm of urinary organ, site unspecified', code: 'C59.9' },
  { id: '2', name: 'Malignant neoplasm of urinary organ, unspecified', code: 'C59.0' },
  { id: '3', name: 'B49 – Unspecified mycosis', code: 'B49' },
  { id: '4', name: 'Mycosis, unspecified', code: 'B48.9' },
  { id: '5', name: 'Epilepsy', code: 'C' },
  { id: '6', name: 'Neoplasm, unspecified, benign or malignant (unspecified)', code: 'D49.9' },
  { id: '7', name: 'Unspecified transport accident', code: 'V99' },
  { id: '8', name: 'Other specified transport accidents', code: 'V98' },
  { id: '9', name: 'Other specified air transport accidents', code: 'V97' },
  { id: '10', name: 'Accident to nonpowered aircraft causing injury to occupant', code: 'V96' },
];

const mockSNOMEDCodes: TerminologyCode[] = [
  { id: '1', name: 'Type 2 diabetes mellitus', code: '44054006' },
  { id: '2', name: 'Essential hypertension', code: '59621000' },
  { id: '3', name: 'Acute myocardial infarction', code: '57054005' },
];

@Component({
  selector: 'app-terminology-services-list',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './terminology-service-list.html',
  styleUrls: ['./terminology-service-list.scss'],
})
export class TerminologyServiceList {
  icd10Codes = mockICD10Codes;
  snomedCodes = mockSNOMEDCodes;
}
