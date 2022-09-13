import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQueryComponent } from './add-query.component';

describe('AddQueryComponent', () => {
  let component: AddQueryComponent;
  let fixture: ComponentFixture<AddQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddQueryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
