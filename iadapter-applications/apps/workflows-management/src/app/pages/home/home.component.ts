import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { antDesignModules } from '../../shared/config/ant-design.modules';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, antDesignModules],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  title = 'home';
}
