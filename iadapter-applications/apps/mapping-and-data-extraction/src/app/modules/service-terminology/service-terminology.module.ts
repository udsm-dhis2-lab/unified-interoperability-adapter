import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './containers/home/home.component';
import { StandardCodesComponent } from './containers/standard-codes/standard-codes.component';
import { GeneralCodesComponent } from './containers/general-codes/general-codes.component';
import { ServiceTerminologyRoutingModule } from './service-terminology-routing.module';

@NgModule({
    declarations: [StandardCodesComponent, GeneralCodesComponent],
    imports: [CommonModule, ServiceTerminologyRoutingModule],
})
export class TerminologyServicesModule { }
