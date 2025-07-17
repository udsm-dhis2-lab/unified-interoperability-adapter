import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion, CompletionContext } from '@codemirror/autocomplete';
import { basicSetup } from 'codemirror';

@Component({
    selector: 'app-sql-editor',
    standalone: true,
    template: `
    <div #editor class="sql-editor" [style.height]="height"></div>
  `,
    styles: [`
    .sql-editor {
      border: 1px solid #d9d9d9;
      border-radius: 4px;
    }
    .sql-editor .cm-editor {
      height: 100%;
    }
  `]
})
export class SqlEditorComponent implements OnInit, OnDestroy {
    @Input() value: string = '';
    @Input() height: string = '250px';
    @Input() theme: 'light' | 'dark' = 'dark';
    @Input() tableSchema: { [tableName: string]: string[] } = {};
    @Output() valueChange = new EventEmitter<string>();

    @ViewChild('editor', { static: true }) editorElement!: ElementRef;

    private editorView?: EditorView;

    ngOnInit() {
        this.initializeEditor();
    }

    ngOnDestroy() {
        this.editorView?.destroy();
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