import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-iadapter-dashboard',
  templateUrl: './iadapter-dashboard.component.html',
  styleUrls: ['./iadapter-dashboard.component.css'],
})
export class IadapterDashboardComponent implements OnInit {
  showSideMenu: boolean = true;
  currentUser$: Observable<any> | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUser$ = of({
      displayName: 'Testing Admin',
      username: 'admin',
    });
  }

  toggleSideMenu(event: Event): void {
    event.stopPropagation();
    this.showSideMenu = !this.showSideMenu;
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
