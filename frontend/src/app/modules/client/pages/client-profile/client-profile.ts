import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { format } from 'date-fns';
import { ClientManagementService } from '../services/client-management.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-client-profile',
  imports: [CommonModule, RouterModule, ...ZORRO_MODULES],
  templateUrl: './client-profile.html',
  styleUrls: ['./client-profile.scss'],
})
export class ClientProfile {
  clientId: string | null;
  client: any;
  loading = signal(true);

  route: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  private readonly clientManegementService = inject(ClientManagementService)

  constructor() {
    this.clientId = this.route.snapshot.paramMap.get('clientId');
  }

  ngOnInit(): void {
    this.getClientById(this.clientId || '');
  }

  getClientById(clientId: string) {
    this.clientManegementService.getClientById(clientId).subscribe(
      {
        next: (data: any) => {
          this.loading.set(false);
          this.client = data.results?.[0];
        },
        error: (err) => {
          throwError(err)
        },
      }
    )
  }

  getIdentifierByType(identifiers: any[], type: string): string {
    return identifiers?.find(id => id.type === type)?.value || '-';
  }


  ageFromDob(date: string): number {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  back(): void {
    this.router.navigate(['/clients']);
  }

  goToDeduplication(): void {
    this.router.navigate(['/deduplication']);
  }
}
