import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ZORRO_MODULES } from '@hdu/shared';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';

@Component({
  selector: 'app-dual-list-select',
  templateUrl: './dual-list-select.html',
  styleUrls: [`dual-list-select.scss`],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...ZORRO_MODULES],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DualListSelectComponent),
      multi: true
    }
  ]
})
export class DualListSelectComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() dataSource: any[] = [];
  @Input() labelKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() titles: string[] = ['Available', 'Selected'];

  transferData: TransferItem[] = [];
  private currentSelectedValues: any[] = []; 

  onChange: (value: any[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource']) {
      this.refreshTransferData();
    }
  }

  private refreshTransferData(): void {
    if (!this.dataSource || this.dataSource.length === 0) {
      this.transferData = [];
      return;
    }

    const selectedSet = new Set(this.currentSelectedValues || []);

    this.transferData = this.dataSource.map(item => {
      const id = item[this.valueKey];
      return {
        key: id,
        title: item[this.labelKey],
        direction: selectedSet.has(id) ? 'right' : 'left',
        disabled: false,
        itemData: item 
      };
    });
  }

  onTransferChange(change: TransferChange): void {
    this.emitCurrentSelection();
  }

  handleDblClick(item: TransferItem): void {
    if (item.disabled) return;
    item.direction = item.direction === 'left' ? 'right' : 'left';
    item.checked = false; 
    this.transferData = [...this.transferData];
    this.emitCurrentSelection();
  }

  private emitCurrentSelection(): void {
    const selectedIds = this.transferData
      .filter((i: any) => i.direction === 'right')
      .map((i: any) => i?.key);

    this.currentSelectedValues = selectedIds;
    this.onChange(selectedIds);
    this.onTouched();
  }

  writeValue(obj: any[]): void {
    this.currentSelectedValues = Array.isArray(obj) ? obj : [];
    this.refreshTransferData(); 
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}