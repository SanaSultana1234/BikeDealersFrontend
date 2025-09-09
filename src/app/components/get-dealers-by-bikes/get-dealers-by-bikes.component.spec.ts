import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDealersByBikesComponent } from './get-dealers-by-bikes.component';

describe('GetDealersByBikesComponent', () => {
  let component: GetDealersByBikesComponent;
  let fixture: ComponentFixture<GetDealersByBikesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDealersByBikesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetDealersByBikesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
