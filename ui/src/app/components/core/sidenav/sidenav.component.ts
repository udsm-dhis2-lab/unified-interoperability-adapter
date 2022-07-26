import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @Input() opened?: boolean;

  showSidenav: boolean = true;

  back: string = '<';

  constructor() {}

  ngOnInit(): void {}

  changeIcon() {
    this.showSidenav = !this.showSidenav;
  }
}
