import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as dwv from 'dwv';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-dicom-viewer',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './dicom-viewer.component.html',
  styleUrl: './dicom-viewer.component.css',
})
export class DicomViewerComponent implements OnInit, OnDestroy {
  @ViewChild('dwvContainer', { static: true }) container!: ElementRef;
  private dwvApp!: dwv.App;
  loading = false;
  errorMessage!: string;

  constructor(private modalRef: NzModalRef) {}

  ngOnInit(): void {
    this.initializeDWV(this.modalRef.getConfig().nzData?.data ?? '');
  }

  ngOnDestroy(): void {
    if (this.dwvApp) {
      this.dwvApp.reset();
    }
  }

  private initializeDWV(url: string): void {
    // Disable logging
    dwv.logger.level = dwv.logger.levels.ERROR;

    // Create the DWV app configuration
    const options = {
      dataViewConfigs: { '*': [{ divId: 'layerGroup0' }] },
      tools: {
        Scroll: {},
        ZoomAndPan: {},
        WindowLevel: {},
      },
    };

    // Create the app
    this.dwvApp = new dwv.App();

    this.dwvApp.init({
      containerDivId: this.container.nativeElement,
      dataViewConfigs: options.dataViewConfigs,
      tools: options.tools,
    } as unknown as dwv.AppOptions);

    this.dwvApp.addEventListener('loadstart', () => {
      this.loading = true;
    });

    this.dwvApp.addEventListener('loadend', () => {
      this.loading = false;
    });

    this.dwvApp.addEventListener('error', (event: { error: string }) => {
      this.loading = false;
      console.log(event);
      this.errorMessage = event['error'];
      if (typeof this.errorMessage !== 'string') {
        this.errorMessage = JSON.stringify(this.errorMessage);
      }
    });
    this.dwvApp.loadURLs([url]);
  }
}
