import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualListSelectComponent } from './dual-list-select';

describe('DualListSelectComponent', () => {
  let component: DualListSelectComponent;
  let fixture: ComponentFixture<DualListSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DualListSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualListSelectComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
