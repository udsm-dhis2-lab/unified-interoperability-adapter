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

  onDownload(event: Event, instance: any): void {
    event.stopPropagation();
    this.instancesService
      .getDataSetQueriesByInstanceUuid(instance?.uuid)
      .subscribe((response: any) => {
        this.downloadFile(response);
      });
  }

  private downloadFile(data: any[]): void {
    let jsonData = JSON.stringify(data);

    //Convert JSON string to BLOB.
    let blodData = new Blob([jsonData], { type: 'text/plain;charset=utf-8' });

    //Check the Browser.
    let isIE = false;
    if (isIE) {
      // window.navigator.msSaveBlob(blob1, "datasetqueries.json");
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
}
