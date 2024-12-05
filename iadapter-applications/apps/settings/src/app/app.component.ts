import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { antDesignModules } from './shared/ant-design.module';

@Component({
  standalone: true,
  imports: [RouterModule, ...antDesignModules],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent {
  title = 'settings';
}
