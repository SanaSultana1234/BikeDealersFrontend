import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDMComponent } from './add-dm.component';

describe('AddDMComponent', () => {
  let component: AddDMComponent;
  let fixture: ComponentFixture<AddDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
