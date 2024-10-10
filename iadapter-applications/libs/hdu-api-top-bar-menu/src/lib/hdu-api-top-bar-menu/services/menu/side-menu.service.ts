import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { menus } from '../../resources/config.menu';
import { Menu } from '../../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class SideMenuService {
  constructor(private router: Router) {}

  // Function to search the menu config based on route
  getMenuNameByRoute(): string {
    const currentRoute = this.router.url; // Get current route path
    return this.searchMenuByRoute(menus, currentRoute);
  }

  // Recursive function to search through the menu and subMenus
  private searchMenuByRoute(menuList: Menu[], route: string): string {
    for (const menu of menuList) {
      // Check if route matches the main menu
      if (menu.routeUrl === route) {
        return menu.name;
      }

      // If subMenus exist, search recursively
      if (menu.subMenus && menu.subMenus.length > 0) {
        const subMenuName = this.searchMenuByRoute(menu.subMenus, route);
        if (subMenuName) {
          return subMenuName;
        }
      }
    }
    return ''; // Return empty string if no match is found
  }
}
