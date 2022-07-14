import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormDesignComponent } from './view-form-design.component';

describe('ViewFormDesignComponent', () => {
  let component: ViewFormDesignComponent;
  let fixture: ComponentFixture<ViewFormDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFormDesignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFormDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
