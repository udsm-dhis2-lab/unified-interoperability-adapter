import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-validation-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './validation-list.html',
  styleUrls: ['./validation-list.scss'],
})
export class ValidationList {}
