import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerMasterTableComponent } from './dealer-master-table.component';

describe('DealerMasterTableComponent', () => {
  let component: DealerMasterTableComponent;
  let fixture: ComponentFixture<DealerMasterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerMasterTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerMasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
