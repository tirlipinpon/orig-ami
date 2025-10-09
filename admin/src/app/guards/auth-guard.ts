import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn();
  
  if (isLoggedIn) {
    return true;
  }

  // Rediriger vers la page de login si non authentifié
  router.navigate(['/login']);
  return false;
};
