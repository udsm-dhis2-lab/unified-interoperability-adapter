import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CodeEditorContainerComponent } from './components/code-editor-container/code-editor-container.component';
import { antDesignModules } from './config/ant-design.modules';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    MonacoEditorModule.forRoot(),
    NgFlowchartModule,
    ...antDesignModules,
    CodeEditorContainerComponent,
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
