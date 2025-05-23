import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlowchartComponent } from './flow-chart.component';

describe('FlowChartComponent', () => {
  let component: FlowchartComponent;
  let fixture: ComponentFixture<FlowchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowchartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlowchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
