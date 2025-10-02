import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showNavigationSubject = new BehaviorSubject<boolean>(true);
  public showNavigation$: Observable<boolean> = this.showNavigationSubject.asObservable();

  // Routes that should hide navigation (full-screen routes)
  private fullScreenRoutes: string[] = [
    '/login',
    '/auth',
    '/error'
  ];

  constructor(private router: Router) {
    // Listen to route changes and update layout accordingly
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateLayoutForRoute(event.urlAfterRedirects);
      });

    // Set initial layout based on current route
    this.updateLayoutForRoute(this.router.url);
  }

  private updateLayoutForRoute(url: string): void {
    const shouldHideNavigation = this.fullScreenRoutes.some(route => 
      url.startsWith(route)
    );
    this.showNavigationSubject.next(!shouldHideNavigation);
  }

  public hideNavigation(): void {
    this.showNavigationSubject.next(false);
  }

  public showNavigation(): void {
    this.showNavigationSubject.next(true);
  }

  public toggleNavigation(): void {
    this.showNavigationSubject.next(!this.showNavigationSubject.value);
  }

  public isNavigationVisible(): boolean {
    return this.showNavigationSubject.value;
  }
}