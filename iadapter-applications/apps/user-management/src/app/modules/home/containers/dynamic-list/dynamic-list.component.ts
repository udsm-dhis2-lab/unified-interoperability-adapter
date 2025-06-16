import { Component, Input } from '@angular/core';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-list',
  standalone: true,
  imports: [NzCollapseModule, CommonModule],
  template: `
    <!-- For non-array data -->
    <ng-container *ngIf="!isList(value)">
      <span *ngIf="isPrimitive(value)">{{ value }}</span>
      <nz-collapse *ngIf="isObject(value) && !isPrimitive(value)">
        <nz-collapse-panel [nzActive]="true">
          <table class="property-table">
            <tbody>
              <tr *ngFor="let key of getObjectKeys(value)">
                <td class="property-key">{{ key }}</td>
                <td class="property-value">
                  <app-dynamic-list [value]="value[key]"></app-dynamic-list>
                </td>
              </tr>
            </tbody>
          </table>
        </nz-collapse-panel>
      </nz-collapse>
    </ng-container>

    <!-- For array data -->
    <ng-container *ngIf="isList(value)">
      <nz-collapse *ngIf="value.length > 0">
        <nz-collapse-panel [nzHeader]="value.length + ' items'" [nzActive]="true">
          <div *ngFor="let item of value; let i = index" class="array-item">
            <div class="item-header">
              <span>Item {{ i }}</span>
            </div>
            <div class="item-content">
              <!-- For primitive array items -->
              <div *ngIf="isPrimitive(item)">{{ item }}</div>

              <!-- For object array items -->
              <table *ngIf="isObject(item) && !isPrimitive(item)" class="property-table">
                <tbody>
                  <tr *ngFor="let key of getObjectKeys(item)">
                    <td class="property-key">{{ key }}</td>
                    <td class="property-value">{{ item[key] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </nz-collapse-panel>
      </nz-collapse>
      <div *ngIf="value.length === 0" class="empty-message">No items</div>
    </ng-container>
  `,
  styles: [`
    .property-table {
      width: 100%;
      border-collapse: collapse;
    }

    .property-table td {
      padding: 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    .property-key {
      width: 30%;
      font-weight: 500;
    }

    .property-value {
      width: 70%;
    }

    .array-item {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e8e8e8;
    }

    .array-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    .item-header {
      font-weight: 500;
      margin-bottom: 8px;
      color: #1890ff;
    }

    .item-content {
      padding-left: 16px;
    }

    .empty-message {
      color: #999;
      font-style: italic;
    }
  `]
})
export class DynamicListComponent {
  @Input() value: any;

  isList(val: any): boolean {
    return Array.isArray(val);
  }

  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  isPrimitive(val: any): boolean {
    return val === null || typeof val !== 'object';
  }

  getObjectKeys(obj: any): string[] {
    if (!this.isObject(obj)) {
      return [];
    }
    return Object?.keys(obj) || [];
  }
}
