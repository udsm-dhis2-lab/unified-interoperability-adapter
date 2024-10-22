import { TestBed } from '@angular/core/testing';

import { DatasetManagementService } from './dataset-management.service';

describe('DatasetManagementService', () => {
  let service: DatasetManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
