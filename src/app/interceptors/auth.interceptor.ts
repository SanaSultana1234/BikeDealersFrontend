// import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AuthService } from '../Services/auth.service';

// export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
//   const authSvc = inject(AuthService);
  
//   if(authSvc.isLoggedIn()) {
//     const token = localStorage.getItem("Token");
//     req = req.clone({
//       setHeaders: {Authorization: `Bearer ${token}`}
//     });
//   }
//   return next(req);
// };



import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  if (authSvc.isLoggedIn()) {
    const token = localStorage.getItem("Token");

    if (token) {
      try {
        // decode token
        const decoded: any = jwtDecode(token);
        const isExpired = Date.now() >= decoded.exp * 1000;

        if (isExpired) {
          authSvc.logout();  // clear storage/session
          router.navigate(['/login']);
          return throwError(() => new Error('Session expired'));
        }

        // attach token to request
        req = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        // if decode fails → log out
        authSvc.logout();
        router.navigate(['/login']);
        return throwError(() => new Error('Invalid token'));
      }
    }
  }

  // catch backend errors (like 401 after role removal)
  return next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        authSvc.logout();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

