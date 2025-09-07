import { TestBed } from '@angular/core/testing';

import { DealerMasterService } from './dealer-master.service';

describe('DealerMasterService', () => {
  let service: DealerMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
