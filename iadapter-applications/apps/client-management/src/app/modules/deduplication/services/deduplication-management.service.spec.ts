import { TestBed } from '@angular/core/testing';

import { DeduplicationManagementService } from './deduplication-management.service';

describe('DeduplicationManagementService', () => {
  let service: DeduplicationManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeduplicationManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
