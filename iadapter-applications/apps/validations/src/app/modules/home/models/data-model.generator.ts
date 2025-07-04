import { FieldGroup, ModelField } from './validation.model';

/**
 * Maps the valueType from the input JSON to our internal ModelField type.
 * @param valueType The type from the JSON (e.g., 'Text', 'Boolean').
 * @returns The corresponding ModelField type.
 */
function mapValueTypeToFieldType(valueType: string): ModelField['type'] {
  switch (valueType.toLowerCase()) {
    case 'boolean':
      return 'boolean';
    case 'number':
      return 'number';
    case 'date':
      return 'date';
    case 'array':
      return 'array';
    default:
      return 'string'; // Default 'Text' and others to string
  }
}

/**
 * Creates a user-friendly label from an object key.
 * Example: 'demographicDetails' -> 'Demographics'
 * @param key The object key from the metaData.
 * @returns A formatted string label.
 */
function formatParentLabel(key: string): string {
  // Remove "Details" and capitalize the first letter
  const formatted = key.replace(/Details/g, '');
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * The main generator function.
 * Takes the metaData object and transforms it into a structured list of field groups.
 * @param metaData The 'metaData' object from your template definition JSON.
 * @returns An array of FieldGroup, structured for use in the UI.
 */
export function generateFieldsFromMetaData(metaData: any): FieldGroup[] {
  if (!metaData) {
    return [];
  }

  const fieldGroups: FieldGroup[] = [];

  // Iterate over each parent key in the metaData object (e.g., 'reportDetails', 'demographicDetails')
  for (const parentKey in metaData) {
    if (Object.prototype.hasOwnProperty.call(metaData, parentKey)) {
      const parentObject = metaData[parentKey];

      // Ensure the object has a 'parameters' array
      if (parentObject && Array.isArray(parentObject.parameters)) {

        // Map each parameter to our ModelField structure
        const children: ModelField[] = parentObject.parameters.map((param: any) => {
          const parentLabel = formatParentLabel(parentKey);

          return {
            // Combine parent and child for a clear, unique label
            label: `${parentLabel} - ${param.name}`,
            // Construct the SpEL-like path
            path: `#{${parentKey}.${param.name}}`,
            // Map the type
            type: mapValueTypeToFieldType(param.valueType),
            // You could add logic here to generate 'options' if a parameter has them
            options: [],
          };
        });

        // Add the complete group to our final array if it has any children
        if (children.length > 0) {
          fieldGroups.push({
            label: formatParentLabel(parentKey),
            children: children,
          });
        }
      }
    }
  }

  return fieldGroups;
}
