import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { basicSetup } from 'codemirror';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FHIR_TABLE_SCHEMAS, TableSchema } from './table-schemas';

@Component({
    selector: 'app-code-editor',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzToolTipModule],
    templateUrl: './sql-editor.component.html',
    styleUrls: ['./sql-editor.component.css']
})
export class CodeEditorComponent implements OnInit, OnDestroy, OnChanges {
    @Input() value: string = '';
    @Input() height: string = '250px';
    @Input() theme: 'light' | 'dark' = 'dark';
    @Input() language: 'sql' | 'javascript' = 'sql';
    @Input() tableSchema: { [tableName: string]: string[] } = FHIR_TABLE_SCHEMAS;
    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('editor', { static: true }) editorElement!: ElementRef;

    private editorView?: EditorView;
    public isFullScreen: boolean = false;

    get editorTitle(): string {
        return this.language === 'sql' ? 'SQL Query Editor' : 'JavaScript Function Editor';
    }

    get editorHeight(): string {
        return this.isFullScreen ? '100%' : this.height;
    }

    ngOnInit() {
        this.initializeEditor();
        this.addKeyboardShortcuts();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] && this.editorView && !changes['value'].firstChange) {
            const newValue = changes['value'].currentValue || '';
            const currentValue = this.editorView.state.doc.toString();

            if (newValue !== currentValue) {
                this.editorView.dispatch({
                    changes: {
                        from: 0,
                        to: this.editorView.state.doc.length,
                        insert: newValue
                    }
                });
            }
        }
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
            this.language === 'sql' ? sql() : javascript(),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    this.valueChange.emit(update.state.doc.toString());
                }
            }),
            autocompletion({
                override: [this.language === 'sql' ? this.sqlCompletions.bind(this) : this.jsCompletions.bind(this)]
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

    private jsCompletions(context: CompletionContext) {
        const word = context.matchBefore(/\w*/);
        if (!word) return null;

        const options = [
            // JavaScript keywords
            { label: 'function', type: 'keyword', info: 'Function declaration' },
            { label: 'return', type: 'keyword', info: 'Return statement' },
            { label: 'if', type: 'keyword', info: 'Conditional statement' },
            { label: 'else', type: 'keyword', info: 'Else clause' },
            { label: 'for', type: 'keyword', info: 'For loop' },
            { label: 'while', type: 'keyword', info: 'While loop' },
            { label: 'const', type: 'keyword', info: 'Constant declaration' },
            { label: 'let', type: 'keyword', info: 'Variable declaration' },
            { label: 'var', type: 'keyword', info: 'Variable declaration' },

            // Common data transformation methods
            { label: '$dataParams', type: 'variable', info: 'Array of input parameters from selected fields' },
            { label: 'join', type: 'method', info: 'Array.join() - Join array elements into string' },
            { label: 'split', type: 'method', info: 'String.split() - Split string into array' },
            { label: 'toUpperCase', type: 'method', info: 'Convert string to uppercase' },
            { label: 'toLowerCase', type: 'method', info: 'Convert string to lowercase' },
            { label: 'trim', type: 'method', info: 'Remove whitespace from string' },
            { label: 'replace', type: 'method', info: 'Replace text in string' },
            { label: 'substring', type: 'method', info: 'Extract substring' },
            { label: 'indexOf', type: 'method', info: 'Find index of substring' },
            { label: 'includes', type: 'method', info: 'Check if string contains substring' },

            // Array methods
            { label: 'map', type: 'method', info: 'Array.map() - Transform array elements' },
            { label: 'filter', type: 'method', info: 'Array.filter() - Filter array elements' },
            { label: 'find', type: 'method', info: 'Array.find() - Find first matching element' },
            { label: 'forEach', type: 'method', info: 'Array.forEach() - Iterate over elements' },
            { label: 'length', type: 'property', info: 'Array/String length property' },

            // Date methods (useful for healthcare data)
            { label: 'Date', type: 'class', info: 'Date constructor' },
            { label: 'new Date()', type: 'constructor', info: 'Create new Date object' },
            { label: 'getFullYear', type: 'method', info: 'Get year from date' },
            { label: 'getMonth', type: 'method', info: 'Get month from date (0-11)' },
            { label: 'getDate', type: 'method', info: 'Get day of month from date' },

            // Common patterns for healthcare data
            { label: 'parseInt', type: 'function', info: 'Parse string to integer' },
            { label: 'parseFloat', type: 'function', info: 'Parse string to float' },
            { label: 'isNaN', type: 'function', info: 'Check if value is NaN' },
            { label: 'JSON.stringify', type: 'method', info: 'Convert object to JSON string' },
            { label: 'JSON.parse', type: 'method', info: 'Parse JSON string to object' }
        ];

        return {
            from: word.from,
            options
        };
    }
}