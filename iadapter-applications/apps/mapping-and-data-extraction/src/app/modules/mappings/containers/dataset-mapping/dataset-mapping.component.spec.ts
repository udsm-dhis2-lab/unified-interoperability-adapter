import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetMappingComponent } from './dataset-mapping.component';

describe('DatasetMappingComponent', () => {
  let component: DatasetMappingComponent;
  let fixture: ComponentFixture<DatasetMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetMappingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
