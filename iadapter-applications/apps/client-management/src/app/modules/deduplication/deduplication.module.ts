import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeduplicationRoutingModule } from './deduplication-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, DeduplicationRoutingModule, SharedModule],
})
export class DeduplicationModule {}
