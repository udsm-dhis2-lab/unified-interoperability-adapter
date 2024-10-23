import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SchedulerParametersComponent } from './scheduler-parameters.component';

describe('SchedulerParametersComponent', () => {
  let component: SchedulerParametersComponent;
  let fixture: ComponentFixture<SchedulerParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerParametersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SchedulerParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
