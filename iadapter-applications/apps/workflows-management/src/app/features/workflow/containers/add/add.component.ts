import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, NzInputModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent {}
