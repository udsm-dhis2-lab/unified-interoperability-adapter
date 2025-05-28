import { TestBed } from '@angular/core/testing';

import { ServicesTerminologyServiceService } from './services-terminology-service.service';

describe('ServicesTerminologyServiceService', () => {
  let service: ServicesTerminologyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesTerminologyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
