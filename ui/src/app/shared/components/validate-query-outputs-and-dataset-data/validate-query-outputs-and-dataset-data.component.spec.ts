import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateQueryOutputsAndDatasetDataComponent } from './validate-query-outputs-and-dataset-data.component';

describe('ValidateQueryOutputsAndDatasetDataComponent', () => {
  let component: ValidateQueryOutputsAndDatasetDataComponent;
  let fixture: ComponentFixture<ValidateQueryOutputsAndDatasetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateQueryOutputsAndDatasetDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateQueryOutputsAndDatasetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
