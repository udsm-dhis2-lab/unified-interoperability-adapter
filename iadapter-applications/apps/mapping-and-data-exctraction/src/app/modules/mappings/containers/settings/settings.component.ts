import { Component } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {}
