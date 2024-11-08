import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MappingAndDataExtractionRoutingModule } from './mapping-and-data-extraction-routing.module';
import { MappingAndDataExtractionComponent } from './mapping-and-data-extraction.component';

@NgModule({
  declarations: [MappingAndDataExtractionComponent],
  imports: [CommonModule, MappingAndDataExtractionRoutingModule],
})
export class MappingAndDataExtractionModule {}
