import { Component, forwardRef, OnInit } from '@angular/core';
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

    // Import Angular's form modules
    FormsModule, // <-- FIXES: "Can't bind to 'ngModel'"
    ReactiveFormsModule,

    // Import the specific NG-ZORRO modules your component's template uses
    NzButtonModule, // <-- FIXES: <button nz-button>
    NzCardModule, // <-- FIXES: <nz-card>
    NzDividerModule, // <-- FIXES: <nz-divider>
    NzIconModule, // <-- FIXES: <i nz-icon>
    NzSelectModule,
  ],
  // ----------------- THIS IS THE CRITICAL FIX -----------------
  // This provider registers the component as a custom form control.
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => RuleBuilderComponent),
  //     multi: true,
  //   },
  // ],
  // -----------------------------------------------------------
})
export class RuleBuilderComponent implements OnInit, ControlValueAccessor {
  // UI State
  groups: RuleGroup[] = [];

  // Expose our data model and operators to the template
  fields: ModelField[] = DATA_MODEL_DEFINITION;
  operators = OPERATORS;

  // ControlValueAccessor methods
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {}

  ngOnInit(): void {
    // Start with one empty group
    if (this.groups.length === 0) {
      this.addGroup();
    }
  }

  // --- Methods to manipulate the UI ---
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
    this.onChange(finalExpression);
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
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
