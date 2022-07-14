import { SourceInterface } from './../../../../resources/interfaces';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-source',
  templateUrl: './add-source.component.html',
  styleUrls: ['./add-source.component.css']
})
export class AddSourceComponent implements OnInit {

  name: string = "";
  username: string = "";
  password: string = "";
  url: string = "";
  active: boolean = false;
  port!: number ;
  showAddForm: boolean = false;
  subscription: Subscription | undefined;

  @Output() onAddSource: EventEmitter<SourceInterface> = new EventEmitter();

  constructor(private uiService?: UiService) { 
    this.subscription = this.uiService?.onToggleAddForm().subscribe((value) => (this.showAddForm = value));
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const newSource = {
      name: this.name,
      username: this.username,
      password: this.password,
      url: this.url,
      active: this.active,
      port: this.port
    }

    this.onAddSource.emit(newSource);

    this.name = '';
    this.username = '';
    this.password = '';
    this.url = '';
    this.active = false;
    this.port = 0;
  }

}
