import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataelementEntryFieldComponent } from './dataelement-entry-field.component';

describe('DataelementEntryFieldComponent', () => {
  let component: DataelementEntryFieldComponent;
  let fixture: ComponentFixture<DataelementEntryFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataelementEntryFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataelementEntryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
