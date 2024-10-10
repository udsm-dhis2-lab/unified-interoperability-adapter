import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';

import { REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
import { antDesignModules } from '../../shared/config/ant-design.modules';

import { MonacoEditorModule } from 'ngx-monaco-editor-v2';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeRoutingModule,
    RouterModule,
    antDesignModules,
    MonacoEditorModule.forRoot(), // use forRoot() in main app module only.
  ],
  providers: [{ provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: false }],
})
export class HomeModule {}
