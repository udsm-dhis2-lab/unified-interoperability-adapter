import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';

interface FacilityDetail {
  id: string;
  code: string;
  name: string;
  accessStatus: string;
  referralConfigured: boolean;
  createdAt: string;
  updatedAt: string;
  additionalParameters: string | null;
  referralConfig: {
    category: string;
    baseUrl: string;
    path: string;
    authType: string;
  } | null;
}

const mockFacilityData: Record<string, FacilityDetail> = {
  '1': {
    id: '1',
    code: '111841-3',
    name: 'BENJAMIN MKAPA HOSPITAL',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '23/01/2026, 15:59:34',
    updatedAt: '23/01/2026, 18:58:34',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://196.192.78.161:8888',
      path: '/MappingTestHIS2/referralWebhook',
      authType: 'BASIC',
    },
  },
  '2': {
    id: '2',
    code: '114394-0',
    name: "WANGING'OMBE",
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '22/01/2026, 10:30:15',
    updatedAt: '22/01/2026, 14:45:22',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://192.168.45.120:8080',
      path: '/api/v1/referrals',
      authType: 'BASIC',
    },
  },
  '3': {
    id: '3',
    code: '108289-0',
    name: 'VWAWA',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '21/01/2026, 08:15:42',
    updatedAt: '21/01/2026, 16:20:10',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://10.20.30.40:9090',
      path: '/referral/webhook',
      authType: 'BEARER',
    },
  },
  '4': {
    id: '4',
    code: '114003-7',
    name: 'UYUI',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '20/01/2026, 11:25:33',
    updatedAt: '20/01/2026, 17:30:45',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://172.16.50.60:8443',
      path: '/his/referral/endpoint',
      authType: 'BASIC',
    },
  },
  '5': {
    id: '5',
    code: '114480-7',
    name: 'UVINZA',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '19/01/2026, 09:40:18',
    updatedAt: '19/01/2026, 13:55:27',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://192.168.100.200:8888',
      path: '/emr/referrals/receive',
      authType: 'BASIC',
    },
  },
  '6': {
    id: '6',
    code: '108211-4',
    name: 'UTETE',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '18/01/2026, 14:20:50',
    updatedAt: '18/01/2026, 18:35:12',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://10.0.0.100:7070',
      path: '/api/referral/webhook',
      authType: 'API_KEY',
    },
  },
  '7': {
    id: '7',
    code: '114024-3',
    name: 'USHETU',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '17/01/2026, 10:10:25',
    updatedAt: '17/01/2026, 15:15:40',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://172.20.30.40:8000',
      path: '/webhook/referral',
      authType: 'BASIC',
    },
  },
  '8': {
    id: '8',
    code: '108166-0',
    name: 'USANGI',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '16/01/2026, 12:45:30',
    updatedAt: '16/01/2026, 16:50:55',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://192.168.1.50:8080',
      path: '/system/referral/api',
      authType: 'BEARER',
    },
  },
  '9': {
    id: '9',
    code: '108148-8',
    name: 'URAMBO',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '15/01/2026, 08:30:45',
    updatedAt: '15/01/2026, 12:40:20',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://10.100.50.25:9000',
      path: '/api/v2/referrals',
      authType: 'BASIC',
    },
  },
  '10': {
    id: '10',
    code: '114553-1',
    name: 'UBUNGO',
    accessStatus: 'Allowed',
    referralConfigured: true,
    createdAt: '14/01/2026, 13:20:15',
    updatedAt: '14/01/2026, 17:25:30',
    additionalParameters: null,
    referralConfig: {
      category: 'REFERRAL',
      baseUrl: 'https://172.30.40.50:8443',
      path: '/integration/referral',
      authType: 'BASIC',
    },
  },
};

@Component({
  selector: 'app-facility-detail-page',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './facility-profile.html',
  styleUrls: ['./facility-profile.scss'],
})
export class FacilityProfile {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  facilityId: string | null = this.route.snapshot.paramMap.get('facilityId');
  facility = this.facilityId ? mockFacilityData[this.facilityId] : null;

  constructor() {}

  backToList(): void {
    this.router.navigate(['/facility-management']);
  }

  editReferral(): void {
    if (!this.facilityId) {
      return;
    }
    this.router.navigate(['/facility-management', this.facilityId, 'referral-configuration']);
  }
}
