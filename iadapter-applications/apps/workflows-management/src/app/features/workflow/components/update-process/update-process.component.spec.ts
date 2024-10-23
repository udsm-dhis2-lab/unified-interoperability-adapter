import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProcessComponent } from './update-process.component';

describe('UpdateProcessComponent', () => {
  let component: UpdateProcessComponent;
  let fixture: ComponentFixture<UpdateProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProcessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
