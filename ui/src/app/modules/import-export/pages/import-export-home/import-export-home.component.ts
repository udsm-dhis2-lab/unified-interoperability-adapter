import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { InstancesService } from 'src/app/services/instances/instances.service';

@Component({
  selector: 'app-import-export-home',
  templateUrl: './import-export-home.component.html',
  styleUrls: ['./import-export-home.component.css'],
})
export class ImportExportHomeComponent implements OnInit {
  showSideMenu: boolean = true;
  currentUser$: Observable<any> | undefined;
  instances$: Observable<any>;

  downloadInProgress: boolean = false;
  fileInput: HTMLInputElement | undefined;

  selectedFileName: string | null = null;
  selectedFile: File | null = null;
  selectedInstance: any | null = null;
  constructor(
    private router: Router,
    private instancesService: InstancesService
  ) {}

  ngOnInit() {
    this.currentUser$ = of({
      displayName: 'Testing Admin',
      username: 'admin',
    });
    this.instances$ = this.instancesService.getInstances();
  }

  toggleSideMenu(event: Event): void {
    event.stopPropagation();
    this.showSideMenu = !this.showSideMenu;
  }
  onLogout(): void {
    this.router.navigate(['/login']);
  }

  onInstanceSelect(event: any): void {
    const selectedUuid = event.value;
    this.instances$.subscribe((instances) => {
      this.selectedInstance = instances.find(
        (instance) => instance.uuid === selectedUuid
      );
    });
  }

  private downloadFile(data: Blob): void {
    let url = window.URL || window.webkitURL;
    let blobUrl = url.createObjectURL(data);
    let a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'dataset_queries.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  onDownload(event: Event, instance: any): void {
    event.stopPropagation();
    this.instancesService
      .getDataSetQueriesByInstanceUuid(instance?.uuid)
      .subscribe((response: any) => {
        this.downloadFile(response);
      });
  }

  handleFileSelection(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file; // Store the file object
      this.selectedFileName = file.name;
    } else {
      this.selectedFile = undefined;
      this.selectedFileName = undefined;
    }
  }

  startImport(): void {
    if (this.selectedInstance && this.selectedFile) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const fileContent = e.target?.result;
        if (fileContent) {
          // Call the service method
          this.instancesService
            .postDataSetQueriesByInstanceUuid(
              this.selectedFile!,
              this.selectedInstance.uuid
            )
            .subscribe({
              next: (response) => {
                console.log('File upload response:', response);
              },
              error: (error) => {
                console.error('Error uploading file:', error);
              },
            });
        }
      };
      fileReader.onerror = (e) => {
        console.error('Error reading file:', e);
      };
      fileReader.readAsText(this.selectedFile);
    } else {
      console.error('Instance or file is not selected.');
      if (!this.selectedInstance) {
        console.error('selectedInstance is not selected.');
      }
      if (!this.selectedFile) {
        console.error('selectedFile is not selected.');
      }
    }
  }
}
