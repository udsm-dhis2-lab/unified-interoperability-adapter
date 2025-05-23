import { Component } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';

@Component({
  selector: 'app-standard-codes',
  templateUrl: './standard-codes.component.html',
  styleUrl: './standard-codes.component.css',
  standalone: true,
  imports: [SharedModule],
})
export class StandardCodesComponent { }
