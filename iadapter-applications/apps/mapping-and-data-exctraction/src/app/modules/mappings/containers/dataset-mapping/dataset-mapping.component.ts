import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute } from '@angular/router';
import { Dataset } from '../../models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dataset-mapping',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dataset-mapping.component.html',
  styleUrl: './dataset-mapping.component.css',
})
export class DatasetMappingComponent implements OnInit {
  dataSetUuid: string = '';
  isLoading: boolean = true;
  datasetFormContent: string = '';
  sanitizedContent!: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private dataSettementService: DatasetManagementService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.dataSetUuid = this.route.snapshot.params['uuid'];
    this.loadDatasetByIdFromServer(this.dataSetUuid);
  }

  loadDatasetByIdFromServer(uuid: string) {
    this.dataSettementService.getInstanceById(uuid).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        const datasetFields = JSON.parse(data.datasetFields);
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
          datasetFields.dataEntryForm.htmlCode
        );
      },
      error: (error: any) => {
        this.isLoading = false;
        // TODO: Implement error handling
      },
    });
  }
}
