import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MonacoEditorModule,
  NGX_MONACO_EDITOR_CONFIG,
  NgxMonacoEditorConfig,
} from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

// Create a configuration object for the Monaco Editor
const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets', // Adjust if necessary
};

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.css',
  providers: [
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }, // Provide the config
  ],
})
export class CodeEditorComponent implements OnInit {
  @Input() editorOptionsParams = {};
  @Input() codeSnippet = '';

  ngOnInit(): void {
    this.editorOptionsParams = { theme: 'vs-dark', language: 'javascript' };
    this.codeSnippet = '';
  }
}
