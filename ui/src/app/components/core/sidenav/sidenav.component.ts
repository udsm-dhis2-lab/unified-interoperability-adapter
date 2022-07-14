import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  showSidenav: boolean = false;

  back: string = '<';

  constructor() { }

  ngOnInit(): void {
  }

  changeIcon(){
    this.showSidenav = !this.showSidenav;
  }

}
