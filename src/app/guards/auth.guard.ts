import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(!authService.isLoggedIn()) {
    router.navigate(['/login']);
  } else if(!authService.isAdmin() && authService.isLoggedIn()) {
    router.navigate(['/error']);
  }
  else return true;
  return false;
};
