import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
