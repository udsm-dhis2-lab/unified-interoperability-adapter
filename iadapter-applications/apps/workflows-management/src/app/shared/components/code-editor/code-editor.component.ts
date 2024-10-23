/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MonacoEditorModule,
  NGX_MONACO_EDITOR_CONFIG,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from '../../../features/workflow/state/workflow/workflow.state';

import { Process } from '../../../features/workflow/models/process.model';
import {
  getProcessUidFromRoute,
  getWorkflowUidFromRoute,
} from '../../../features/workflow/helpers/workflow.helper';
import { skip, take } from 'rxjs';
import { ProcessActions } from '../../../features/workflow/state/process/process.actions';
import { omit } from 'lodash';
import { getCurrentSelectedProcess } from '../../../features/workflow/state/process/process.selectors';
import { WorkflowActions } from '../../../features/workflow/state/workflow/workflow.actions';

// Create a configuration object for the Monaco Editor
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // Adjust if necessary
};

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    FormsModule,
    NgFlowchartModule,
    RouterModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzButtonModule,
    NzGridModule,
    NzModalModule,
    NzCardModule,
    NzCollapseModule,
    NzFormModule,
  ],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss',
  providers: [
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }, // Provide the config
  ],
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

  ngOnInit(): void {
    this.editorOptionsParams = { theme: 'vs-dark', language: 'javascript' };
    this.codeSnippet =
      'function x() {\nconsole.log("Welcome to HDU Implementation!");\n}';

    this.workflowState
      .pipe(select(getCurrentSelectedProcess), take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess && currentSelectedProcess.script) {
          this.codeSnippet = currentSelectedProcess?.script;
        }
      });

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
            this.codeSnippet = process.script;
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
