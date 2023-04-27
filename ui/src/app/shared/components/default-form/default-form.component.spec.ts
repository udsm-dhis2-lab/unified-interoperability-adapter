import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFormComponent } from './default-form.component';

describe('DefaultFormComponent', () => {
  let component: DefaultFormComponent;
  let fixture: ComponentFixture<DefaultFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
