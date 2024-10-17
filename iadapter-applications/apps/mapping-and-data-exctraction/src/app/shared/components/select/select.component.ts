import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'custom-select',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input({
    required: true,
  })
  placeHolder: string = '';

  selectedItem?: any;

  @Output() onSearchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onSelectChange = new EventEmitter<string[]>();

  @Input({
    required: true,
  })
  isLoading: boolean = false;

  @Input({
    required: true,
  })
  optionList: any[] = [];

  @Input()
  isMultiple: boolean = true;

  onSearch(value: string) {
    this.onSearchChange.emit(value);
  }

  onSelect(value: any): void {
    if (!this.isMultiple) {
      this.onSelectChange.emit([value]);
      return;
    }
    const filteredValue = value.filter((item: any) => item !== '');
    this.onSelectChange.emit(filteredValue);
  }
}
