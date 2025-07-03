export interface ModelField {
  label: string; // Human-readable name for the UI
  path: string; // The SpEL expression path
  type: 'enum' | 'boolean' | 'number' | 'computed_field' | 'collection_size';
  options?: { label: string; value: string }[]; // For enums
}

// This constant defines the entire schema available to the rule builder.
// We are abstracting the complexity of SpEL here.
export const DATA_MODEL_DEFINITION: ModelField[] = [
  {
    label: "Mother's Overall HIV Status",
    path: '#{postnatalDetails.hivDetails.status}',
    type: 'enum',
    options: [
      { label: 'Positive', value: 'T(com.Adapter.icare.Enums.STATUS).POSITIVE' },
      { label: 'Negative', value: 'T(com.Adapter.icare.Enums.STATUS).NEGATIVE' },
      { label: 'Unknown', value: 'null' }
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

export const OPERATORS = [
    { label: 'is equal to', value: '==' },
    { label: 'is not equal to', value: '!=' },
    { label: 'is greater than', value: '>' },
    { label: 'is less than', value: '<' }
];
