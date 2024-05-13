import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaygroundModalComponent } from './playground-modal.component';

describe('PlaygroundModalComponent', () => {
  let component: PlaygroundModalComponent;
  let fixture: ComponentFixture<PlaygroundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaygroundModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaygroundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
