import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  message: string | undefined;

  @Input() showAddInstanceForm?: boolean;
  
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
    if (this.name === undefined || this.username === ''){
      this.message = "This field is required"
    }
    if (this.username === undefined || this.username === ''){
      this.message = "This field is required"
    }
    if (this.url === undefined || this.url === ''){
      this.message = "This field is required"
    }
    if (this.password === undefined || this.password === ''){
      this.message = "This field is required"
    }

    if(this.name && this.username && this.url && this.password){
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
      this.message = undefined;
    }
  }


}
