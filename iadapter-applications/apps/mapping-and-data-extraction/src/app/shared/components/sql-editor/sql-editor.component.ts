import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { basicSetup } from 'codemirror';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FHIR_TABLE_SCHEMAS, TableSchema } from './table-schemas';

@Component({
    selector: 'app-sql-editor',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzToolTipModule],
    templateUrl: './sql-editor.component.html',
    styleUrls: ['./sql-editor.component.css']
})
export class SqlEditorComponent implements OnInit, OnDestroy {
    @Input() value: string = '';
    @Input() height: string = '250px';
    @Input() theme: 'light' | 'dark' = 'dark';
    @Input() tableSchema: { [tableName: string]: string[] } = FHIR_TABLE_SCHEMAS;
    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('editor', { static: true }) editorElement!: ElementRef;

    private editorView?: EditorView;
    public isFullScreen: boolean = false;

    get editorHeight(): string {
        return this.isFullScreen ? 'calc(100vh - 35px)' : this.height;
    }

    ngOnInit() {
        this.initializeEditor();
        this.addKeyboardShortcuts();
    }

    ngOnDestroy() {
        this.editorView?.destroy();
        this.removeKeyboardShortcuts();
    }

    toggleFullScreen(): void {
        this.isFullScreen = !this.isFullScreen;

        setTimeout(() => {
            this.editorView?.requestMeasure();
        }, 100);
    }

    private addKeyboardShortcuts(): void {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private removeKeyboardShortcuts(): void {
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    private handleKeyDown(event: KeyboardEvent): void {
        // ESC key to exit full screen
        if (event.key === 'Escape' && this.isFullScreen) {
            this.toggleFullScreen();
        }

        // F11 or Ctrl+Enter to toggle full screen (when editor has focus)
        if ((event.key === 'F11' || (event.ctrlKey && event.key === 'Enter')) &&
            this.editorElement.nativeElement.contains(document.activeElement)) {
            event.preventDefault();
            this.toggleFullScreen();
        }
    }

    private initializeEditor() {
        const extensions = [
            basicSetup,
            sql(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.valueChange.emit(update.state.doc.toString());
                }
            }),
            autocompletion({
                override: [this.sqlCompletions.bind(this)]
            })
        ];

        if (this.theme === 'dark') {
            extensions.push(oneDark);
        }

        const state = EditorState.create({
            doc: this.value,
            extensions
        });

        this.editorView = new EditorView({
            state,
            parent: this.editorElement.nativeElement
        });
    }

    private sqlCompletions(context: CompletionContext) {
        const word = context.matchBefore(/\w*/);
        if (!word) return null;

        const options = [];

        // Add table suggestions
        for (const tableName of Object.keys(this.tableSchema)) {
            options.push({
                label: tableName,
                type: 'keyword',
                info: `Table: ${tableName}`
            });
        }

        // Add column suggestions
        for (const [tableName, columns] of Object.entries(this.tableSchema)) {
            for (const column of columns) {
                options.push({
                    label: `${tableName}.${column}`,
                    type: 'property',
                    info: `Column: ${column} in ${tableName}`
                });
            }
        }

        return {
            from: word.from,
            options
        };
    }
}