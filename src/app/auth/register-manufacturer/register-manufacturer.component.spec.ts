import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterManufacturerComponent } from './register-manufacturer.component';

describe('RegisterManufacturerComponent', () => {
  let component: RegisterManufacturerComponent;
  let fixture: ComponentFixture<RegisterManufacturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterManufacturerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterManufacturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
