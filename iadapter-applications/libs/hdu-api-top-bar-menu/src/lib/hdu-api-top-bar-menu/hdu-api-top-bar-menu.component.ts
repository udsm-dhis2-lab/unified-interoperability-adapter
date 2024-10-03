import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'lib-hdu-api-top-bar-menu',
  standalone: true,
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzPageHeaderModule,
  ],
  templateUrl: './hdu-api-top-bar-menu.component.html',
  styleUrl: './hdu-api-top-bar-menu.component.less',
})
export class HduApiTopBarMenuComponent {}
