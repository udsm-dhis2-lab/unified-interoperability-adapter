import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserInfo {
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  #isAuthenticated = signal(false);
  #userInfo = signal<UserInfo | null>(null);

  isAuthenticated = computed(() => {
    return this.#isAuthenticated();
  });

  userInfo = computed(() => {
    return this.#userInfo();
  });

  login(email: string): void {
    this.#isAuthenticated.set(true);
    this.#userInfo.set({
      name: 'Dr. Amina Mwakasege',
      email,
      role: 'Health Professional',
    });
  }

  logout(): void {
    this.#isAuthenticated.set(false);
    this.#userInfo.set(null);
  }
}
