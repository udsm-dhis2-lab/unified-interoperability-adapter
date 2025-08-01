import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { omit } from 'lodash';
import {
  NGX_MONACO_EDITOR_CONFIG,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { take } from 'rxjs';
import { Process } from '../../../features/workflow/models/process.model';
import { ProcessActions } from '../../../features/workflow/state/process/process.actions';
import { getCurrentSelectedProcess } from '../../../features/workflow/state/process/process.selectors';
import { WorkflowActions } from '../../../features/workflow/state/workflow/workflow.actions';
import { WorkflowState } from '../../../state/app.state';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // Adjust if necessary
};
@Component({
  selector: 'app-code-editor-container',
  templateUrl: './code-editor-container.component.html',
  styleUrl: './code-editor-container.component.scss',
  imports: [MonacoEditorModule, NzButtonModule],
  standalone: true,
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }],
})
export class CodeEditorContainerComponent implements OnInit {
  @Input() editorOptionsParams: any;
  @Input() codeSnippet = '';
  @Output() editedCodeSnippet: EventEmitter<string> =
    new EventEmitter<string>();

  constructor(
    private workflowState: Store<WorkflowState>,
    private processState: Store<Process>
  ) {}
  ngOnInit(): void {
    console.log(this.codeSnippet);
  }

  onUpdateProcessCodeSnippet() {
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
