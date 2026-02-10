import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZORRO_MODULES } from '@hdu/shared';

@Component({
  selector: 'app-datasets-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './data-set-list.html',
  styleUrls: ['./data-set-list.scss'],
})
export class DataSetList {}
