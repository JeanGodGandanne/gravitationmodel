import { TestBed } from '@angular/core/testing';

import { EzbService } from './ezb.service';

describe('EzbService', () => {
  let service: EzbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EzbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
