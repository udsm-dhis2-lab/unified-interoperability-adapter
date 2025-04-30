import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
})
export class SelectComponent {
  @Input({
    required: true,
  })
  placeHolder = '';

  selectedItem?: any;

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectChange = new EventEmitter<any>();

  @Input({
    required: true,
  })
  isLoading = false;

  @Input({
    required: true,
  })
  optionList: any[] = [];

  @Input()
  isMultiple = true;

  onSearch(value: string) {
    this.searchChange.emit(value);
  }

  onSelect(value: any): void {
    if (!this.isMultiple) {
      console.log('value', value);
      this.selectChange.emit(value);
      return;
    }
    const filteredValue = value.filter((item: any) => item !== '');
    this.selectChange.emit(filteredValue);
  }
}
