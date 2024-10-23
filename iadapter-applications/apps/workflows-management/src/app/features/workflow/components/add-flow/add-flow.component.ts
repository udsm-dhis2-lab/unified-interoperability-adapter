/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabPosition, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon'; // Import NzIconModule
import { NzInputModule } from 'ng-zorro-antd/input';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CodeEditorComponent } from 'apps/workflows-management/src/app/shared/components/code-editor/code-editor.component';
import { ProcessState } from 'apps/workflows-management/src/app/features/workflow/state/process/process.state';
import { select, Store } from '@ngrx/store';
import { WorkflowState } from 'apps/workflows-management/src/app/features/workflow/state/workflow/workflow.state';
import { Workflow } from 'apps/workflows-management/src/app/features/workflow/models/workflow.model';
import { getCurrentSelectedWorkflow } from '../../state/workflow/workflow.selectors';
import { NzCardModule } from 'ng-zorro-antd/card';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzButtonModule,
    NzGridModule,
    NzTabsModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    MonacoEditorModule,
    CodeEditorComponent,
    ReactiveFormsModule,
    NzCardModule
  ],
  templateUrl: './add-flow.component.html',
  styleUrl: './add-flow.component.scss',
})
export class AddFlowComponent implements OnInit {
  processForm!: FormGroup;
  currentSelectedWorkflow!: Workflow;
  selectedTabIndex = 0;
  nzTabPosition!: NzTabPosition;

  constructor(
    private fb: FormBuilder,
    private processState: Store<ProcessState>,
    private workFlowState: Store<WorkflowState>
  ) {}

  ngOnInit(): void {
    this.processForm = this.fb.group({
      name: ['', [Validators.required]], // Validates for numbers
      description: ['', [Validators.required]], // Also validates for numbers
    });
  }

  onSubmit() {
    if (this.processForm.valid) {
      this.workFlowState
        .pipe(select(getCurrentSelectedWorkflow), take(1))
        .subscribe((workflow: Workflow | null) => {
          if (workflow) {
            this.currentSelectedWorkflow = workflow;
          }
        });

      const formValues = this.processForm.value;
      const payload = {
        name: formValues.name,
        description: formValues.description,
        script: this.code,
        workflow: this.currentSelectedWorkflow.id,
      };

      return payload;
    } else {
      console.log('Form is not valid');
      return null;
    }
  }

  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code = 'function x() {\nconsole.log("Hello world!");\n}';


  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  currentConfig = {
    theme: 'vs-dark', // Default theme
    language: 'javascript', // Default language
  };

  // Method to handle theme changes
  onThemeChange(selectedTheme: string) {
    this.currentConfig.theme = selectedTheme;
    this.editorOptions = {
      ...this.editorOptions,
      theme: selectedTheme,
    };
  }

  // Method to handle language changes
  onLanguageChange(selectedLanguage: string) {
    this.currentConfig.language = selectedLanguage;
    this.editorOptions = {
      ...this.editorOptions,
      language: selectedLanguage,
    };
  }

  onTabChange(event: any) {
    console.log('', event);
  }
}
