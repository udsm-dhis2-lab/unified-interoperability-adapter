import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'antd/dist/antd.css';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'login';
}
