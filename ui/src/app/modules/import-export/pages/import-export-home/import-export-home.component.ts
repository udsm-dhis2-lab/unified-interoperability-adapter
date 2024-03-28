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
  selectedInstance: any;

  constructor(
    private router: Router,
    private instancesService: InstancesService
  ) {

  }
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

  onDownload(event: Event, instance: any): void {
    event.stopPropagation();
    this.instancesService
      .getDataSetQueriesByInstanceUuid(instance?.uuid)
      .subscribe((response: any) => {
        console.log("this is data", instance);
        this.downloadFile(response);
      });
  }
  private downloadFile(data: any[]): void {
    let jsonData = JSON.stringify(data);

    let blodData = new Blob([jsonData], { type: 'text/plain;charset=utf-8' });
    
    let isIE = false;

    if (isIE) {
    } else {
      let url = window.URL || window.webkitURL;
      let link = url.createObjectURL(blodData);
      let a = document.createElement('a');
      a.download = 'datasetqueries.json';
      a.href = link;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }




  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent: string | ArrayBuffer | null = reader.result;
      if (fileContent) {
        const jsonContent: any = JSON.parse(fileContent.toString());
        console.log('JSON file content:', jsonContent);
        
      }
    };
    reader.readAsText(file);
  }

  startImport(): void {
    // import logic here
  }

}
