import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExportHomeComponent } from './import-export-home.component';

describe('ImportExportHomeComponent', () => {
  let component: ImportExportHomeComponent;
  let fixture: ComponentFixture<ImportExportHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportExportHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportExportHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
