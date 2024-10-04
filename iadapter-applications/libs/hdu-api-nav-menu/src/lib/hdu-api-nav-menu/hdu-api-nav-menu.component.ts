import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { icons } from './ant-design-icons.constants';
import { antDesignModules } from './ant-design.modules';
import { Menu } from './menu.model';

@Component({
  selector: 'lib-hdu-api-nav-menu',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './hdu-api-nav-menu.component.html',
  styleUrl: './hdu-api-nav-menu.component.less',
  providers: [{ provide: NZ_ICONS, useValue: icons }],
})
export class HduApiNavMenuComponent {
  @Input()
  menus!: Menu[];

  @Output() selectedMenu: EventEmitter<Menu> = new EventEmitter<Menu>();

  constructor() {}

  onRouteTo(event: Event, menu: Menu): void {
    event.stopPropagation();
    this.selectedMenu.emit(menu);
  }
}
