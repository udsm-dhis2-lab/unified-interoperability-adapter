import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionFormComponent } from './section-form.component';

describe('SectionFormComponent', () => {
  let component: SectionFormComponent;
  let fixture: ComponentFixture<SectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
