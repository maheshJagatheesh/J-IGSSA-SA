import { TestBed } from '@angular/core/testing';

import { LaderService } from './lader.service';

describe('LaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaderService = TestBed.get(LaderService);
    expect(service).toBeTruthy();
  });
});
