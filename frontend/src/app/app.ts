import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Layout } from '@hdu/core';
import { SessionWarningModalComponent } from './core/components/dialogs/session-warning-modal/session-warning.modal';
import { MainPage } from "./core/components/main-page/main-page";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  
}
