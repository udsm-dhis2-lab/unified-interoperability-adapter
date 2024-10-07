import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from 'apps/login/src/app/shared/ant-design-modules';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { antDesignIcons } from 'apps/login/src/app/shared/ant-design-icons.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
