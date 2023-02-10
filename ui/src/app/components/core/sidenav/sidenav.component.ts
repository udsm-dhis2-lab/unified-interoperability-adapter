import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() opened?: boolean;
  @Input() selectedRoute: string | undefined;

  showSidenav: boolean = true;
  isAdmin: boolean = false;
  param?: string;

  back: string = '<';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // this.selectedRoute =
    console.log(this.route.snapshot.queryParams);
    this.route.queryParams.subscribe((params) => {
      this.param = params['admin'];

      if (this.param === 'admin') {
        this.isAdmin = true;
      }
    });
  }

  changeIcon() {
    this.showSidenav = !this.showSidenav;
  }

  onChangeRoute(event: Event, route: string): void {
    event.stopPropagation();
    this.selectedRoute = route;
    this.router.navigate(['/' + this.selectedRoute], {
      queryParams: { admin: 'admin' },
    });
  }
}
