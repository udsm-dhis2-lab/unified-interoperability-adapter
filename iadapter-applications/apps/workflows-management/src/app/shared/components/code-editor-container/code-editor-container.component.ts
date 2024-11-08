import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NGX_MONACO_EDITOR_CONFIG,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { Process } from '../../../features/workflow/models/process.model';
import { WorkflowState } from '../../../state/app.state';
import { Store, select } from '@ngrx/store';
import { getCurrentSelectedProcess } from '../../../features/workflow/state/process/process.selectors';
import { ProcessActions } from '../../../features/workflow/state/process/process.actions';
import { omit } from 'lodash';
import { WorkflowActions } from '../../../features/workflow/state/workflow/workflow.actions';
import { take } from 'rxjs';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // Adjust if necessary
};
@Component({
  selector: 'app-code-editor-container',
  templateUrl: './code-editor-container.component.html',
  styleUrl: './code-editor-container.component.scss',
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }],
})
export class CodeEditorContainerComponent implements OnInit {
  @Input() editorOptionsParams: any;
  @Input() codeSnippet: string = '';
  @Output() editedCodeSnippet: EventEmitter<string> =
    new EventEmitter<string>();

  constructor(
    private workflowState: Store<WorkflowState>,
    private processState: Store<Process>
  ) {}
  ngOnInit(): void {}

  onUpdateProcessCodeSnippet(event: Event): void {
    event.stopPropagation();
    this.editedCodeSnippet.emit(this.codeSnippet);
    this.workflowState
      .pipe(select(getCurrentSelectedProcess), take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess) {
          this.processState.dispatch(
            ProcessActions.updateProcess({
              process: {
                ...omit(currentSelectedProcess, ['children']),
                script: this.codeSnippet,
              },
            })
          );
          this.workflowState.dispatch(
            WorkflowActions.setSelectedProcess({
              process: {
                ...currentSelectedProcess,
                script: this.codeSnippet,
              },
            })
          );
        }
      });
  }
}
