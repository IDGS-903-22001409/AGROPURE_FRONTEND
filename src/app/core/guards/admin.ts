import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Admin Guard - Checking authentication...');
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Is admin:', authService.isAdmin());
  console.log('Current user:', authService.getCurrentUser());

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  console.log('Access denied - redirecting to home');
  router.navigate(['/']);
  return false;
};
