import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute } from '@angular/router';
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

  selectedInputId: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataSettementService: DatasetManagementService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private elRef: ElementRef,
    private cdr: ChangeDetectorRef
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
        this.cdr.detectChanges();
        this.addFocusListeners();
      },
      error: (error: any) => {
        this.isLoading = false;
        // TODO: Implement error handling
      },
    });
  }

  addFocusListeners(): void {
    const inputElements = this.elRef.nativeElement.querySelectorAll('input');
    inputElements.forEach((input: HTMLInputElement) => {
      this.renderer.listen(input, 'focus', (event) => this.onInputFocus(event));
    });
  }

  onInputFocus(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const inputId = inputElement.id;
    this.selectedInputId = inputId;
    // if (!isDisabled) {
    //   this.renderer.setStyle(inputElement, 'background-color', '#2C6693');
    //   this.renderer.setProperty(inputElement, 'disabled', true);

    // }
  }
}
