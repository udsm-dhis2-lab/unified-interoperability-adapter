import { UiService } from 'src/app/services/ui.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  loading?: any;

  constructor(
    private loader: UiService
  ) { }

  ngOnInit(): void {
    setTimeout(() => { 
    this.loading = this.loader.loading$;
     }, 0);
  }

  toggleAddForm() {
  }

}
