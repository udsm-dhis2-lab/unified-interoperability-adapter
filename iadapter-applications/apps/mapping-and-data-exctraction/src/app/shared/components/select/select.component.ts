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

  @Input({
    required: true,
  })
  selectedItem?: string;

  @Output() onSearchChange: EventEmitter<string> = new EventEmitter<string>();

  @Input({
    required: true,
  })
  isLoading: boolean = false;

  @Input({
    required: true,
  })
  optionList: any[] = [];

  onSearch(value: string) {
    this.onSearchChange.emit(value);
  }
}
