import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { InstanceInterface } from 'src/app/resources/interfaces';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-instance',
  templateUrl: './add-instance.component.html',
  styleUrls: ['./add-instance.component.css']
})
export class AddInstanceComponent implements OnInit {

  name: string = "";
  username: string = "";
  password: string = "";
  url: string = "";

  showAddInstanceForm: boolean = false;
  subscription: Subscription | undefined;

  @Output() onAddInstance: EventEmitter<InstanceInterface> = new EventEmitter();
  
  constructor(private uiService?: UiService) {
    this.subscription = this.uiService?.onToggleAddInstanceForm().subscribe(
      (value: boolean) => (this.showAddInstanceForm = value)
    );
   }

  ngOnInit(): void {
  }

  onSubmit(){
    const newInstance = {
      name: this.name,
      username: this.username,
      password: this.password,
      url: this.url
    }

    this.onAddInstance.emit(newInstance);

    this.name = '';
    this.username = '';
    this.password = '';
    this.url = '';
  }


}
