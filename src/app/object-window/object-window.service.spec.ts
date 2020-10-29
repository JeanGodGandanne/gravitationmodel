import { TestBed } from '@angular/core/testing';

import { ObjectWindowService } from './object-window.service';

describe('ObjectWindowService', () => {
  let service: ObjectWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
