// reusable-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reusable-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule],
  template: `
    <nz-modal
      [nzVisible]="visible"
      [nzTitle]="title"
      [nzOkLoading]="isOkLoading"
      (nzOnOk)="onOk()"
      (nzOnCancel)="onCancel()"
    >
      <p *nzModalContent>{{ content }}</p>
    </nz-modal>
  `
})
export class ReusableModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() content: string = 'Default content';
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  isOkLoading = false;

  onOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isOkLoading = false;
      this.visibleChange.emit(false);
      this.ok.emit();
    }, 2000);
  }

  onCancel(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }
}
