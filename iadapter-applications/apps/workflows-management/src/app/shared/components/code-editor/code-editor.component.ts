/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MonacoEditorModule,
  NGX_MONACO_EDITOR_CONFIG,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../../features/workflow/state/workflow/workflow.state';

import { Process } from '../../../features/workflow/models/process.model';
import {
  getProcessUidFromRoute,
  getWorkflowUidFromRoute,
} from '../../../features/workflow/helpers/workflow.helper';
import { Observable, skip, take } from 'rxjs';
import { ProcessActions } from '../../../features/workflow/state/process/process.actions';
import { omit } from 'lodash';
import { getCurrentSelectedProcess } from '../../../features/workflow/state/process/process.selectors';
import { WorkflowActions } from '../../../features/workflow/state/workflow/workflow.actions';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared.module';

// Create a configuration object for the Monaco Editor
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // Adjust if necessary
};

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss',
  providers: [],
})
export class CodeEditorComponent implements OnInit {
  @Output() codeSnippetEmitter = new EventEmitter<string>();

  constructor(
    private workflowState: Store<WorkflowState>,
    private processState: Store<Process>,
    private route: ActivatedRoute
  ) {}

  @Input() editorOptionsParams: any;
  @Input() codeSnippet = '';
  currentSelectedProcess$: Observable<any> = new Observable();

  ngOnInit(): void {
    this.editorOptionsParams = { theme: 'vs-dark', language: 'javascript' };
    this.codeSnippet =
      'function x() {\nconsole.log("Welcome to HDU Implementation!");\n}';

    this.currentSelectedProcess$ = this.workflowState.pipe(
      select(getCurrentSelectedProcess)
    );

    const currentWorkflowUid = getWorkflowUidFromRoute(this.route);

    const currentProcessUid = getProcessUidFromRoute(this.route);

    if (currentWorkflowUid) {
      this.workflowState.dispatch(
        WorkflowActions.loadWorkflow({
          id: currentWorkflowUid,
        })
      );
    }

    if (currentProcessUid) {
      this.processState.dispatch(
        ProcessActions.loadProcess({
          id: currentProcessUid,
        })
      );

      this.processState
        .pipe(select(getCurrentSelectedProcess), skip(1), take(1))
        .subscribe((process: Process | null) => {
          if (process && process.script) {
            this.workflowState.dispatch(
              WorkflowActions.setSelectedProcess({ process })
            );
            // this.codeSnippet = process.script;
          }
        });
    }
  }

  onThemeChange(selectedTheme: string) {
    this.editorOptionsParams.theme = selectedTheme;
    this.editorOptionsParams = {
      ...this.editorOptionsParams,
      theme: selectedTheme,
    };
  }

  onLanguageChange(selectedLanguage: string) {
    this.editorOptionsParams.language = selectedLanguage;
    this.editorOptionsParams = {
      ...this.editorOptionsParams,
      language: selectedLanguage,
    };
  }

  onUpdateProcessCodeSnippet() {
    this.currentSelectedProcess$ = this.workflowState.pipe(
      select(getCurrentSelectedProcess)
    );
    this.currentSelectedProcess$.subscribe(
      (currentSelectedProcess: Process | null) => {
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
      }
    );
  }
}
