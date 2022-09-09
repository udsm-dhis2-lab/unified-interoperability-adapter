import { TestBed } from '@angular/core/testing';

import { InstanceDatasetsService } from './instance-dataset.service';

describe('InstanceDatasetService', () => {
  let service: InstanceDatasetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceDatasetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
