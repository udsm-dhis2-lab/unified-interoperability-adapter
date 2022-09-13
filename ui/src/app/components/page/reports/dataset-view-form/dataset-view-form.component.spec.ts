import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetViewFormComponent } from './dataset-view-form.component';

describe('CustomFormComponent', () => {
  let component: DatasetViewFormComponent;
  let fixture: ComponentFixture<DatasetViewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetViewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
