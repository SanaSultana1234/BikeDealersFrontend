import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BikesTableComponent } from './bikes-table.component';

describe('BikesTableComponent', () => {
  let component: BikesTableComponent;
  let fixture: ComponentFixture<BikesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BikesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BikesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
