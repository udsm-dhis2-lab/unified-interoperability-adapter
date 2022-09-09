
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { SourceInterface } from 'src/app/models/source.model';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css']
})
export class AddSourceComponent implements OnInit {

  type: string = "";
  username: string = "";
  password: string = "";
  url: string = "";
  active: boolean = false;
  port!: number ;
  showAddForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;

  @Output() onAddSource: EventEmitter<SourceInterface> = new EventEmitter();

  constructor(private uiService?: UiService) { 
    this.subscription = this.uiService?.onToggleAddForm().subscribe((value) => (this.showAddForm = value));
  }

  ngOnInit(): void {
  }

  onSubmit(){
    if (this.type === undefined || this.type === '') {
      this.message = 'This field is required';
    }
    if (this.username === undefined || this.username === '') {
      this.message = 'This field is required';
    }
    if (this.url === undefined || this.url === '') {
      this.message = 'This field is required';
    }
    if (this.password === undefined || this.password === '') {
      this.message = 'This field is required';
    }

    if(this.type && this.username && this.url && this.password){
      const newSource = {
        type: this.type,
        username: this.username,
        password: this.password,
        url: this.url
      }
  
      this.onAddSource.emit(newSource);
  
      this.type = '';
      this.username = '';
      this.password = '';
      this.url = '';
      this.message = '';
    }
  }

}
