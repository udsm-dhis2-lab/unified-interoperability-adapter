import { TestBed } from '@angular/core/testing';

import { HduHttpService } from './hdu-http.service';

describe('HduHttpService', () => {
  let service: HduHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HduHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
