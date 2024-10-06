import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/client-management/src/app/shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  constructor(private router: Router) {}
  backToList() {
    this.router.navigate(['']);
  }
}
