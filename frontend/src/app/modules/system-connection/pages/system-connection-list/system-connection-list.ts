import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZORRO_MODULES } from '@hdu/shared';

interface Instance {
  sn: number;
  name: string;
  url: string;
  code: string;
}

const mockInstances: Instance[] = [
  {
    sn: 1,
    name: 'HF (Living lab) and TLAND',
    url: 'http://0.80.84.6/iland-upgrade',
    code: 'MOH_TEST_INSTANCE',
  },
  {
    sn: 2,
    name: 'DHIS2 HDU',
    url: 'http://dhis2-api:8080/dhis',
    code: 'HDU_DHIS',
  },
  {
    sn: 3,
    name: 'DHIS2 HMIS Live',
    url: 'http://0.80.84.17:9091',
    code: 'HLive',
  },
];

@Component({
  selector: 'app-system-connection-list',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES],
  templateUrl: './system-connection-list.html',
  styleUrls: ['./system-connection-list.scss'],
})
export class SystemConnection {
  instances = mockInstances;
}
