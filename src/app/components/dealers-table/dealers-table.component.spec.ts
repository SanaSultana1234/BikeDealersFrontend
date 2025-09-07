import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealersTableComponent } from './dealers-table.component';

describe('DealersTableComponent', () => {
  let component: DealersTableComponent;
  let fixture: ComponentFixture<DealersTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealersTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
