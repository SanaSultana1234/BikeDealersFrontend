import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBikesByDealersComponent } from './get-bikes-by-dealers.component';

describe('GetBikesByDealersComponent', () => {
  let component: GetBikesByDealersComponent;
  let fixture: ComponentFixture<GetBikesByDealersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetBikesByDealersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetBikesByDealersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
