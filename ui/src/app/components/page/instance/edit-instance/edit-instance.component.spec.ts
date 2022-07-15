import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInstanceComponent } from './edit-instance.component';

describe('EditInstanceComponent', () => {
  let component: EditInstanceComponent;
  let fixture: ComponentFixture<EditInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
