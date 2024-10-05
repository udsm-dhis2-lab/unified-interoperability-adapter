import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';

@Component({
  selector: 'app-deduplication-home',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './deduplication-home.component.html',
  styleUrl: './deduplication-home.component.css',
})
export class DeduplicationHomeComponent {}
