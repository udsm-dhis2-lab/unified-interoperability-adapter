import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { GeneralCodesComponent } from '../general-codes/general-codes.component';
import { StandardCodesComponent } from '../standard-codes/standard-codes.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [SharedModule, RouterModule, GeneralCodesComponent, StandardCodesComponent], // Added RouterModule and NzTabsModule
})
export class HomeComponent {


}
