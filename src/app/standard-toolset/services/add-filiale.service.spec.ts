import { TestBed } from '@angular/core/testing';

import { AddFilialeService } from './add-filiale.service';

describe('AddFilialeService', () => {
  let service: AddFilialeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddFilialeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
