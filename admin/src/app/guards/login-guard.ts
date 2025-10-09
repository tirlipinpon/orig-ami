import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const loginGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn();
  
  if (isLoggedIn) {
    // Si l'utilisateur est déjà connecté, rediriger vers /edit
    router.navigate(['/edit']);
    return false;
  }

  // Sinon, autoriser l'accès à la page de login
  return true;
};

