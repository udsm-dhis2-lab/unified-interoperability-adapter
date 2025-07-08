import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Import the specific type for nodes for better type safety
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

@Component({
  // 1. Improved, generic selector name
  selector: 'app-tree-select',
  standalone: true,
  imports: [FormsModule, NzTreeSelectModule],
  template: `
    <nz-tree-select
      style="width: 100%"
      [nzNodes]="nodes"
      [nzExpandedKeys]="expandedKeys"
      [nzCheckable]="isCheckable"
      [nzAllowClear]="allowClear"
      [nzShowSearch]="showSearch"
      [nzPlaceHolder]="placeholder"
      [ngModel]="selectedValues"
      (ngModelChange)="onSelectionChange($event)"
    ></nz-tree-select>
  `
})
export class TreeSelectComponent {
  // --- INPUTS: For configuration from the parent ---

  /** The data for the tree nodes */
  @Input() nodes: NzTreeNodeOptions[] = [];

  /** The initial selected values. Note: nzCheckable makes this an array. */
  @Input() selectedValues: string[] | null = null;

  /** Keys of nodes that should be expanded by default */
  @Input() expandedKeys: string[] = [];

  /** Configuration options with sensible defaults */
  @Input() placeholder = 'Please select';
  @Input() isCheckable = true;
  @Input() allowClear = true;
  @Input() showSearch = true;

  // --- OUTPUT: For emitting events to the parent ---

  /** Emits the new array of selected keys whenever the selection changes */
  @Output() selectionChange = new EventEmitter<string[] | null>();

  /**
   * Internal handler that fires when the user changes the selection.
   * It emits the event to the parent component.
   */
  onSelectionChange(values: string[] | null): void {
    this.selectionChange.emit(values);
  }
}
