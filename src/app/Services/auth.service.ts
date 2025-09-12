// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap, throwError } from 'rxjs';
import { DealerRegister } from '../models/auth/dealer-register';
import { UserRegister } from '../models/auth/user-register';
import { LoginModel } from '../models/auth/login-model';
import { BikeModel } from '../models/data/bike-model';
import { UserModel } from '../models/data/user-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private bSubject: BehaviorSubject<string> = new BehaviorSubject<string>('None');
  private baseUrl = 'https://localhost:7273/api/Auth'; // <-- update with your backend port
  email: string | null =null;
  errorMessage: string ='';

  constructor(private http: HttpClient, private router: Router) {}

  loginWithGoogle(idToken: string) {
    return this.http.post<any>(`${this.baseUrl}/external-login`, {
      provider: 'Google',
      idToken
    });
  }

  login(loginUser: LoginModel): Observable<any> {
    console.log(this.baseUrl+' User Name: '+ loginUser.username);
    console.log(loginUser);
    return this.http.post<any>(`${this.baseUrl}/login`, loginUser).pipe(
      tap((response) => {
        if(response.token) {
          console.log('Message: ', response.message);
          console.log("Response: ", response);
          console.log('Token: ' ,response.token);
          localStorage.setItem('Token', response.token);
          const tokenPart = response.token.split('.');
          let payload = JSON.parse(atob(tokenPart[1]));
          this.email = payload.email;
          //console.log('Role: '+ payload.role);
          localStorage.setItem('userRole', payload.role);
          console.log("Payload: ", payload);
          this.bSubject.next(payload.role);
        }
      })
    )
  }

  saveToken(token: string) {
    localStorage.setItem('Token', token);
  }

  getUserName(): string | null {
    const token = localStorage.getItem('Token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Adjust field depending on your backend payload (email, name, unique_name etc.)
      console.log("payload from auth serive: ", payload)
      return payload?.username || payload?.email || null;
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }
  

  getUserRole(): string {
    const userRole = localStorage.getItem('userRole') || '{}';
    return userRole;
  }
  
  registerUser(model: UserRegister): Observable<any> {
    return this.http.post<UserRegister>(`${this.baseUrl}/register-user`, model)
          .pipe(retry(1), catchError(this.errorHandler));
  }

  registerDealer(model: DealerRegister): Observable<any> {
    return this.http.post<DealerRegister>(`${this.baseUrl}/register-dealer`, model)
            .pipe(retry(1), catchError(this.errorHandler));
  }

  registerManufacturer(model: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-manufacturer`, model)
            .pipe(retry(1), catchError(this.errorHandler));
  }

  isLoggedIn() {
    let role = localStorage.getItem('userRole');
    let token = localStorage.getItem('Token');
    if((role?.includes('Admin') || role?.includes('User')  ||role?.includes('Dealer') || role?.includes('Manufacturer')) && token!=null) return true;
    return false;
  }

  isLoggedInFromObservable(): string {
    let role: string ='';
    this.bSubject.subscribe(value => {role=value;});
    return role;
  }

  isAdmin() {
    return localStorage.getItem('userRole')?.includes('Admin');
  }

  logout() {
    localStorage.clear();
    this.bSubject.next('None');
  }

  private errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;  // Client-side or network error
    } else {
       errorMessage = `Server error (Code: ${error.status}): ${error.message}`; // Backend returned an error response
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
