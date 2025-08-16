import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: (route: any, state: any) => (boolean) = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Eliminado console.log
  if (authService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};

export const homeGuard: (route: any, state: any) => (boolean) = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Eliminado console.log
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    authService.logout();
    return false;
  }

  return true;
}; 