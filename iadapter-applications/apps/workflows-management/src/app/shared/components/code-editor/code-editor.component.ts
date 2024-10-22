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
import {
  getCurrentSelectedProcess,
  getCurrentSelectedWorkflow,
} from '../../../features/workflow/state/workflow/workflow.selectors';
import { Process } from '../../../features/workflow/models/process.model';
import { getUidFromRoute } from '../../../features/workflow/helpers/workflow.helper';
import { WorkflowActions } from '../../../features/workflow/state/workflow/workflow.actions';
import { skip, take } from 'rxjs';
import { Workflow } from '../../../features/workflow/models/workflow.model';
import { ProcessActions } from '../../../features/workflow/state/process/process.actions';

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
    this.codeSnippet = 'function x() {\nconsole.log("Hello world!");\n}';

    this.workflowState
      .pipe(select(getCurrentSelectedProcess), take(1))
      .subscribe((currentSelectedProcess: Process | null) => {
        if (currentSelectedProcess && currentSelectedProcess.script) {
          this.codeSnippet = currentSelectedProcess?.script;
        }
      });

    const currentWorkflowUid = getUidFromRoute(this.route);

    if (currentWorkflowUid) {
      this.workflowState.dispatch(
        WorkflowActions.loadWorkflow({
          id: currentWorkflowUid,
        })
      );

      this.workflowState
        .pipe(select(getCurrentSelectedWorkflow), skip(1), take(1))
        .subscribe((workflow: Workflow | null) => {
          if (workflow && workflow.process && workflow.process.script) {
            this.codeSnippet = workflow.process.script;
          }
        });
    }
  }

  // Method to handle theme changes
  onThemeChange(selectedTheme: string) {
    this.editorOptionsParams.theme = selectedTheme;
    this.editorOptionsParams = {
      ...this.editorOptionsParams,
      theme: selectedTheme,
    };
  }

  // Method to handle language changes
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
                ...currentSelectedProcess,
                script: this.codeSnippet,
              },
            })
          );
        }
      });
  }
}
