import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MappingAndDataExtractionComponent } from './mapping-and-data-extraction.component';

describe('MappingAndDataExtractionComponent', () => {
  let component: MappingAndDataExtractionComponent;
  let fixture: ComponentFixture<MappingAndDataExtractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MappingAndDataExtractionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MappingAndDataExtractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
