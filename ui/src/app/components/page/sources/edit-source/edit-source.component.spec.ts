import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSourceComponent } from './edit-source.component';

describe('EditSourceComponent', () => {
  let component: EditSourceComponent;
  let fixture: ComponentFixture<EditSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
