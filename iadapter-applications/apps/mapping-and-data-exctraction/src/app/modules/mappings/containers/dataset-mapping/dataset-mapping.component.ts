import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';
import { DatasetManagementService } from '../../services/dataset-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dataset-mapping',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dataset-mapping.component.html',
  styleUrl: './dataset-mapping.component.css',
})
export class DatasetMappingComponent implements OnInit {
  dataSetUuid: string = '';

  constructor(
    private route: ActivatedRoute,
    private dataSettementService: DatasetManagementService
  ) {}

  ngOnInit(): void {
    this.dataSetUuid = this.route.snapshot.params['uuid'];

    this.loadDatasetByIdFromServer(this.dataSetUuid);
  }

  loadDatasetByIdFromServer(uuid: string) {
    this.dataSettementService.getInstanceById(uuid).subscribe({
      next: (data: any) => {
        console.log(data, 'RETURNED DATA TEST');
      },
      error: (error: any) => {
        // TODO: Implement error handling
        console.log(error, 'ERRORR');
      },
    });
  }
}
