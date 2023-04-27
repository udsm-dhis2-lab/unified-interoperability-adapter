import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dataelement-entry-field',
  templateUrl: './dataelement-entry-field.component.html',
  styleUrls: ['./dataelement-entry-field.component.css'],
})
export class DataelementEntryFieldComponent implements OnInit {
  @Input() entryInput: any | undefined;
  @Input() dataElement: any | undefined;
  @Output() openDialog: EventEmitter<any> = new EventEmitter<any>();
  id: string | undefined;
  constructor() {}

  ngOnInit(): void {
    this.id = this.dataElement?.id + '-' + this.entryInput?.id + '-val';
  }

  onOpenDialog(event: Event, id: string | undefined): void {
    event.stopPropagation();
    this.openDialog.emit(id);
  }
}
