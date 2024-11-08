import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from './config/ant-design.modules';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { CodeEditorContainerComponent } from './components/code-editor-container/code-editor-container.component';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';

@NgModule({
  declarations: [CodeEditorContainerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule,
    NgFlowchartModule,
    ...antDesignModules,
  ],
  exports: [
    FormsModule,
    NgFlowchartModule,
    MonacoEditorModule,
    ...antDesignModules,
    CodeEditorContainerComponent,
  ],
})
export class SharedModule {}
