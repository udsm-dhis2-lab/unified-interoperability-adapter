import { FieldGroup } from './validation.model';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

/**
 * Transforms the FieldGroup[] structure into a format compatible with nz-tree-select.
 *
 * @param fieldGroups The array of field groups with parent-child relationships.
 * @returns An array of NzTreeNodeOptions suitable for [nzData].
 */
export function transformFieldsToTreeNodes(fieldGroups: FieldGroup[]): NzTreeNodeOptions[] {
  return fieldGroups.map(group => {
    // Create the parent node
    const parentNode: NzTreeNodeOptions = {
      title: group.label,
      key: group.label, // Use a unique key; label is fine here.
      isLeaf: false, // This is a parent, not a leaf.
      selectable: false, // Prevent the parent category itself from being selected.
      children: group.children.map(field => {
        // Create the child node
        return {
          title: field.label, // The full label like "Demographics - First Name"
          key: field.path,    // The SpEL path is the actual value we want
          isLeaf: true,      // This is a selectable leaf node
        };
      }),
    };
    return parentNode;
  });
}
