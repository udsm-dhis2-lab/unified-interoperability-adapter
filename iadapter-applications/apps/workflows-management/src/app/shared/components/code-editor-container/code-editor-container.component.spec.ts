import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodeEditorContainerComponent } from './code-editor-container.component';

describe('CodeEditorContainerComponent', () => {
  let component: CodeEditorContainerComponent;
  let fixture: ComponentFixture<CodeEditorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeEditorContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeEditorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
