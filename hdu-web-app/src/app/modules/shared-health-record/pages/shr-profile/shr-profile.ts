import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { mockClients, mockHealthEncounters } from 'src/app/core/data/mock-data';
import { Diagnosis, HealthEncounter, LabResult, Medication } from '@hdu/core';

@Component({
  selector: 'app-shr-detail-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './shr-profile.html',
  styleUrls: ['./shr-profile.scss'],
})
export class ShrProfile {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  clientId = this.route.snapshot.paramMap.get('clientId');
  client = mockClients.find((c) => c.id === this.clientId) || null;
  clientEncounters = mockHealthEncounters.filter((e) => e.clientId === this.clientId);

  allDiagnoses: Diagnosis[] = this.clientEncounters.flatMap((e) => e.diagnosis);
  allMedications: Medication[] = this.clientEncounters.flatMap((e) => e.medications);
  allLabResults: LabResult[] = this.clientEncounters.flatMap((e) => e.labResults);

  constructor() {}

  back(): void {
    this.router.navigate(['/shared-health-records']);
  }

  syncStatusColor(status: HealthEncounter['syncStatus']): 'success' | 'processing' | 'error' {
    if (status === 'synced') return 'success';
    if (status === 'pending') return 'processing';
    return 'error';
  }

  diagnosisStatusColor(status: Diagnosis['status']): string {
    if (status === 'active') return 'red';
    if (status === 'chronic') return 'orange';
    return 'green';
  }

  medicationStatusColor(status: Medication['status']): string {
    if (status === 'active') return 'green';
    if (status === 'completed') return 'blue';
    return 'default';
  }

  labStatusColor(status: LabResult['status']): 'success' | 'warning' | 'error' {
    if (status === 'normal') return 'success';
    if (status === 'abnormal') return 'warning';
    return 'error';
  }
}
