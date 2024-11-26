import { TestBed } from '@angular/core/testing';

import { InstanceManagementService } from './instance-management.service';

describe('InstanceManagementService', () => {
  let service: InstanceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
