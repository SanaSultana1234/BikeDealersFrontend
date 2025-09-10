import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDMComponent } from './edit-dm.component';

describe('EditDMComponent', () => {
  let component: EditDMComponent;
  let fixture: ComponentFixture<EditDMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDMComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
