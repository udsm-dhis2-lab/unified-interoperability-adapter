import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'login';

  ngOnInit(): void {
    // Component initialized
  }

  ngAfterViewInit(): void {
    // Ensure the page is visible after view is ready
    setTimeout(() => {
      document.body.classList.add('ng-loaded');
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.display = 'none';
      }
    }, 50);
  }
}
