export interface ModelField {
  label: string; // Human-readable name for the UI
  path: string; // The SpEL expression path
  type: 'enum' | 'boolean' | 'number' | 'string' | 'date' | 'array' | 'computed_field' | 'collection_size';
  options?: { label: string; value: string }[]; // For enums
}


export interface ValidationRule {
  id?: string; // Optional, as it won't exist for new rules
  code: string;
  name: string;
  errorMessage: string;
  description: string;
  ruleExpression: string;
}

export interface FieldGroup {
  label: string; // The parent name, e.g., "Demographics"
  children: ModelField[]; // The list of fields under that parent
}

// This constant defines the entire schema available to the rule builder.
// We are abstracting the complexity of SpEL here.


export const OPERATORS = [
  { label: 'is equal to', value: '==' },
  { label: 'is not equal to', value: '!=' },
  { label: 'is greater than', value: '>' },
  { label: 'is less than', value: '<' },
];

export const DATA_MODEL_DEFINITION: ModelField[] = [
  {
    label: "Mother's Overall HIV Status",
    path: '#{postnatalDetails.hivDetails.status}',
    type: 'enum',
    options: [
      { label: 'Positive', value: 'T(com.Adapter.icare.Enums.STATUS).POSITIVE' },
      { label: 'Negative', value: 'T(com.Adapter.icare.Enums.STATUS).NEGATIVE' },
      { label: 'Unknown', value: "null" }
    ]
  },
  {
    label: 'Total Number of Births',
    path: '#{postnatalDetails.birthDetails.size()}',
    type: 'collection_size'
  },
  {
    label: 'Number of Births with Mother HIV Positive',
    path: '#{postnatalDetails.birthDetails.?[motherHivStatus == true].size()}',
    type: 'computed_field'
  },
  {
    label: 'Number of Births with Mother HIV Negative',
    path: '#{postnatalDetails.birthDetails.?[motherHivStatus == false].size()}',
    type: 'computed_field'
  },
  {
    label: 'Number of Births with Mother HIV Unknown',
    path: '#{postnatalDetails.birthDetails.?[motherHivStatus == null].size()}',
    type: 'computed_field'
  }
];


// This constant is now an array of groups, directly matching the desired UI structure.
// export const DATA_MODEL_DEFINITION: FieldGroup[] = [
//   {
//     label: 'Report',
//     children: [
//       {
//         label: 'Report - reportingDate',
//         path: '#{reportDetails.reportingDate}',
//         type: 'date',
//       },
//     ],
//   },
//   {
//     label: 'Facility',
//     children: [
//       {
//         label: 'Facility - HFRCode',
//         path: '#{facilityDetails.HFRCode}',
//         type: 'string',
//       },
//     ],
//   },
//   {
//     label: 'Visit',
//     children: [
//       { label: 'Visit - id', path: '#{visitDetails.id}', type: 'number' },
//       {
//         label: 'Visit - visitDate',
//         path: '#{visitDetails.visitDate}',
//         type: 'date',
//       },
//       {
//         label: 'Visit - newThisYear',
//         path: '#{visitDetails.newThisYear}',
//         type: 'boolean',
//       },
//       { label: 'Visit - isNew', path: '#{visitDetails.isNew}', type: 'boolean' },
//       {
//         label: 'Visit - closedDate',
//         path: '#{visitDetails.closedDate}',
//         type: 'date',
//       },
//     ],
//   },
//   {
//     label: 'Demographic',
//     children: [
//       { label: 'Demographic - mrn', path: '#{demographicDetails.mrn}', type: 'string' },
//       {
//         label: 'Demographic - firstName',
//         path: '#{demographicDetails.firstName}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - middleName',
//         path: '#{demographicDetails.middleName}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - lastName',
//         path: '#{demographicDetails.lastName}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - dateOfBirth',
//         path: '#{demographicDetails.dateOfBirth}',
//         type: 'date',
//       },
//       {
//         label: 'Demographic - gender',
//         path: '#{demographicDetails.gender}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - phoneNumbers',
//         path: '#{demographicDetails.phoneNumbers}',
//         type: 'array',
//       },
//       {
//         label: 'Demographic - emails',
//         path: '#{demographicDetails.emails}',
//         type: 'array',
//       },
//       {
//         label: 'Demographic - occupation',
//         path: '#{demographicDetails.occupation}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - maritalStatus',
//         path: '#{demographicDetails.maritalStatus}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - nationality',
//         path: '#{demographicDetails.nationality}',
//         type: 'string',
//       },
//       {
//         label: 'Demographic - addresses',
//         path: '#{demographicDetails.addresses}',
//         type: 'array',
//       },
//       {
//         label: 'Demographic - identifiers',
//         path: '#{demographicDetails.identifiers}',
//         type: 'array',
//       },
//       {
//         label: 'Demographic - contactPeople',
//         path: '#{demographicDetails.contactPeople}',
//         type: 'array',
//       },
//       {
//         label: 'Demographic - paymentDetails',
//         path: '#{demographicDetails.paymentDetails}',
//         type: 'array',
//       },
//     ],
//   },
//   {
//     label: 'Admission',
//     children: [
//       {
//         label: 'Admission - admissionDate',
//         path: '#{admissionDetails.admissionDate}',
//         type: 'date',
//       },
//       {
//         label: 'Admission - admissionDiagnosis',
//         path: '#{admissionDetails.admissionDiagnosis}',
//         type: 'string',
//       },
//       {
//         label: 'Admission - dischargedOn',
//         path: '#{admissionDetails.dischargedOn}',
//         type: 'date',
//       },
//       {
//         label: 'Admission - dischargeStatus',
//         path: '#{admissionDetails.dischargeStatus}',
//         type: 'string',
//       },
//     ],
//   },
//   {
//     label: 'Billings',
//     children: [
//       { label: 'Billings - billID', path: '#{billingsDetails.billID}', type: 'string' },
//       {
//         label: 'Billings - billingCode',
//         path: '#{billingsDetails.billingCode}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - billType',
//         path: '#{billingsDetails.billType}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - insuranceName',
//         path: '#{billingsDetails.insuranceName}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - insuranceCode',
//         path: '#{billingsDetails.insuranceCode}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - amountBilled',
//         path: '#{billingsDetails.amountBilled}',
//         type: 'number',
//       },
//       {
//         label: 'Billings - exemptionType',
//         path: '#{billingsDetails.exemptionType}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - wavedAmount',
//         path: '#{billingsDetails.wavedAmount}',
//         type: 'string',
//       },
//       {
//         label: 'Billings - billDate',
//         path: '#{billingsDetails.billDate}',
//         type: 'date',
//       },
//     ],
  // },
// ];
