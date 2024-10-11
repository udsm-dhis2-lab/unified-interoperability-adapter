import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './ant-design-modules';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [CommonModule, ...antDesignModules],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  @Input({
    required: true,
  })
  labelText: string = '';
}
