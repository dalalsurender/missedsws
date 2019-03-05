import { TestBed } from '@angular/core/testing';

import { CityworksService } from './cityworks.service';

describe('CityworksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CityworksService = TestBed.get(CityworksService);
    expect(service).toBeTruthy();
  });
});
