import { Component } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-exctraction/src/app/shared/shared.module';

@Component({
  selector: 'app-dataset-mapping',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dataset-mapping.component.html',
  styleUrl: './dataset-mapping.component.css',
})
export class DatasetMappingComponent {}
