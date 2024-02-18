import { TestBed } from '@angular/core/testing';

import { GameRouteService } from './game-route.service';

describe('RouteService', () => {
  let service: GameRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
