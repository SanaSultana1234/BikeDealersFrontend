import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../Services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // check if logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // get roles from route metadata
  const requiredRoles = route.data['roles'] as Array<string>;

  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = authService.getUserRole(); // e.g. "User,Dealer"

    // handle null
    if (!userRoles) {
      router.navigate(['/unauthorized']);
      return false;
    }

    // split roles by comma into array
    const roleArray = userRoles.split(',').map(r => r.trim()); // ["User", "Dealer"]

    console.log("Guard check -> required:", requiredRoles, "user:", roleArray);

    // check if any of the user roles matches a required role
    const hasAccess = requiredRoles.some(role => roleArray.includes(role));

    if (!hasAccess) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }

  return true;
};
