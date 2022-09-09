import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() opened?: boolean;

  showSidenav: boolean = true;
  isAdmin: boolean = false;
  param?: string;

  back: string = '<';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.param = params['admin'];

        if (this.param === "admin") {

          this.isAdmin = true

        }

      });

  }




  changeIcon() {
    this.showSidenav = !this.showSidenav;
  }
}
