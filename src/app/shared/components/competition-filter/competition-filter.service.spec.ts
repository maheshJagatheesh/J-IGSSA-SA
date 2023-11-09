import { TestBed } from '@angular/core/testing';

import { CompetitionFilterService } from './competition-filter.service';

describe('CompetitionFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompetitionFilterService = TestBed.get(CompetitionFilterService);
    expect(service).toBeTruthy();
  });
});
