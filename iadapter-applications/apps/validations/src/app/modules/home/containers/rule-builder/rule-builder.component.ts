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
// format date
import { formatDate } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select'; // <-- IMPORT THIS
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree'; // <-- IMPORT THIS
import { TreeSelectComponent } from '../app-selection/app-selection';
import { DISPLAY_DATA_TEMPLATE } from '../../../../shared/validators.constants';
import { transformToDataModel } from '../../../../shared/helpers/helpers';
// import { DATA_MODEL_DEFINITION, ModelField, OPERATORS } from '../data-model';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number'; // <-- IMPORT
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

export interface RuleCondition {
  leftOperandPath?: string;
  leftOperandType: 'value' | 'text';
  operator?: string;
  rightOperandPath?: string;
  rightOperandType: 'value' | 'text';
}

export interface RuleGroup {
  conditions: RuleCondition[];
}

interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
}

export interface SelectedField {
  label: string;
  type: 'STRING' | 'NUMBER' | 'BOOLEAN'; // Define the possible types
  path: string;
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
    NzTreeSelectModule,
    NzInputModule, // <-- ADD
    NzInputNumberModule, // <-- ADD
    NzToolTipModule,
    NzDatePickerModule,
  ],
})
export class RuleBuilderComponent implements OnInit, ControlValueAccessor {
  // UI State
  groups: RuleGroup[] = [];

  date = null;

  currentSelection: string | null = null;
  leftCurrentSelection: string | null = null;
  rightCurrentSelection: string | null = null;
  defaultExpandedKeys = ['cat-1', 'cat-1-0'];

  readonly categoryNodes: NzTreeNodeOptions[] = DISPLAY_DATA_TEMPLATE;

  // Expose our data model and operators to the template
  fields: any = DATA_MODEL_DEFINITION;
  operators = OPERATORS;
  treeData: any = {
    title: 'key',
    expanded: true,
    children: [],
    isLeaf: false,
  };

  booleanFields: any = ['true', 'false'];

  // ControlValueAccessor methods
  @Output() valueChange = new EventEmitter<string>();

  onTouched: () => void = () => {};
  secondFieldType!: string;
  fieldValue!: string;

  constructor() {}

  ngOnInit(): void {
    // this.treeData = transformFieldsToTreeNodes(DATA_MODEL_DEFINITION);

    // Start with one empty group
    if (this.groups.length === 0) {
      this.addGroup();
    }

    console.log(transformToDataModel());
  }

  addGroup(): void {
    this.groups.push({
      conditions: [
        {
          rightOperandType: 'text',
          leftOperandType: 'text',
        },
      ], // Start with one empty condition
    });
    this.updateRule();
  }

  removeGroup(groupIndex: number): void {
    this.groups.splice(groupIndex, 1);
    this.updateRule();
  }

  addCondition(group: RuleGroup): void {
    group.conditions.push({
      rightOperandType: 'text',
      leftOperandType: 'text',
    });
    this.updateRule();
  }

  onChange(result: Date): void {
    this.groups = this.groups.map((group) => {
      group.conditions = group.conditions.map((condition) => {
        condition.rightOperandPath = `#{${formatDate(result, 'yyyy-MM-dd', 'en-US')}}`;

        return condition;
      });
      return group;
    });
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

  updateField(event: any) {
    this.fieldValue = event;
  }

  updateLeftValue(event: any): void {
    this.groups = this.groups.map((group) => {
      group.conditions = group.conditions.map((condition) => {
        if (event != null && this.fields[event] !== undefined) {
          condition.leftOperandPath = this.fields[event].path;
          this.processField(this.fields[event]);
        } else {
          condition.leftOperandPath = `#{${event}}`;
        }

        return condition;
      });
      return group;
    });
    this.updateRule();
  }

  updateRightValue(event: any): void {
    console.log('event', event);
    this.groups = this.groups.map((group) => {
      group.conditions = group.conditions.map((condition) => {
        if (event != null && this.fields[event] !== undefined) {
          condition.rightOperandPath = this.fields[event].path;
          this.processField(this.fields[event]);
        } else {
          condition.rightOperandPath = `#{${event}}`;
        }
        return condition;
      });
      return group;
    });
    this.updateRule();
  }

  processField(input: any): void {
    console.log('input', input);

    if (input.type === 'BOOLEAN') {
      this.secondFieldType = 'BOOLEAN';
    } else if (input.type === 'STRING') {
      this.secondFieldType = 'STRING';
    } else if (input.type === 'NUMBER') {
      this.secondFieldType = 'NUMBER';
    } else if (input.type === 'DATE') {
      this.secondFieldType = 'DATE';
    }
  }

  onRightOperandFieldChange(
    condition: RuleCondition,
    selectedValue: SelectedField | null
  ): void {
    // When selecting a field, the value is its path
    condition.rightOperandPath = selectedValue ? selectedValue.path : undefined;
    this.updateRule();
  }

  toggleRightOperandType(condition: RuleCondition): void {
    console.log('toggleRightOperandType', condition);
    condition.rightOperandPath =
      condition.rightOperandType === 'text' ? 'value' : 'text';
    // Reset value when toggling to avoid mismatches
    condition.rightOperandPath = undefined;
    this.updateRule();
  }

  // --- Core Logic ---
  updateRule(event?: any): void {
    // console.log('updateRule', this.fields[event]);
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

  handleSelectionChange(selectedKeys: any | null): void {
    console.log(
      'Event received from child component:',
      this.fields[selectedKeys!]
    );
    this.currentSelection = selectedKeys;
  }

  buildNode(
    value: any,
    title: string,
    path: string,
    visited: WeakSet<object>
  ): TreeNode {
    if (typeof value !== 'object' || value === null) {
      return {
        title: `${title}`,
        key: path,
        isLeaf: true,
      };
    }

    if (visited.has(value)) {
      return {
        title: `${title}: [Circular Reference]`,
        key: path,
        isLeaf: true,
      };
    }

    visited.add(value);

    let children: TreeNode[];

    if (Array.isArray(value)) {
      children = [];
      for (let item of value) {
        children = Object.entries(item).map(([key, val]) => {
          return this.buildNode(val, key, `${path}.${key}`, visited);
        });
        break;
      }
    } else {
      children = Object.entries(value).map(([key, val]) => {
        return this.buildNode(val, key, `${path}.${key}`, visited);
      });
    }

    visited.delete(value);

    return {
      title,
      key: path,
      children: children?.length > 0 ? children : undefined,
    };
  }

  formatDataTemplate() {
    let dataTemplate = '';

    dataTemplate = JSON.parse(dataTemplate);

    if (
      typeof dataTemplate !== 'object' ||
      dataTemplate === null ||
      Array.isArray(dataTemplate)
    ) {
      console.error('Invalid input: The function expects a non-array object.');
      return [];
    }
    const visited = new WeakSet<object>();
    return Object.entries(dataTemplate).map(([key, value]) => {
      return this.buildNode(value, key, key, visited);
    });
  }
}
