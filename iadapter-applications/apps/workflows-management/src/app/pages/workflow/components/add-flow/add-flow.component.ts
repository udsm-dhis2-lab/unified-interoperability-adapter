/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon'; // Import NzIconModule
import { NzInputModule } from 'ng-zorro-antd/input';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CodeEditorComponent } from 'apps/workflows-management/src/app/shared/components/code-editor/code-editor.component';

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
  ],
  templateUrl: './add-flow.component.html',
  styleUrl: './add-flow.component.scss',
})
export class AddFlowComponent {
  editorOptions = { theme: 'vs-dark', language: 'javascript' };
  code = 'function x() {\nconsole.log("Hello world!");\n}';

  handleCustomAction() {
    throw new Error('Method not implemented.');
  }
  isVisible = false;

  constructor() {
    // Empty
  }

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
      theme: selectedTheme
    }
  }

  // Method to handle language changes
  onLanguageChange(selectedLanguage: string) {
    this.currentConfig.language = selectedLanguage;
    this.editorOptions = {
      ...this.editorOptions,
      language: selectedLanguage
    }
  }
}
