import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLogged = authService.isLoggedIn();

  if (!isLogged) {
    router.navigate(['login']);
    return false;
  }

  return true;
};
