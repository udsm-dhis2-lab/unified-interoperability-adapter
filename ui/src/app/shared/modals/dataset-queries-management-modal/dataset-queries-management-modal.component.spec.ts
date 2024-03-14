import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetQueriesManagementModalComponent } from './dataset-queries-management-modal.component';

describe('DatasetQueriesManagementModalComponent', () => {
  let component: DatasetQueriesManagementModalComponent;
  let fixture: ComponentFixture<DatasetQueriesManagementModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatasetQueriesManagementModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetQueriesManagementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
