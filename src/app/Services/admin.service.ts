import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, retry, tap, throwError } from 'rxjs';
import { DealerRegister } from '../models/auth/dealer-register';
import { UserModel } from '../models/data/user-model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private bSubject: BehaviorSubject<string> = new BehaviorSubject<string>('None');
  private baseUrl = 'https://localhost:7273/api/Admin'; // <-- update with your backend port

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/users/count`);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.baseUrl}/list-users`)
                .pipe(retry(1), catchError(this.errorHandler));
  }

  getUserById(userId: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/get-user/${userId}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  
  approveDealer(userId: String): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve-dealer/${userId}`, {})
      .pipe(retry(1), catchError(this.errorHandler));
  }
  
  // removeDealer(userId: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/remove-dealer/${userId}`, {})
  //     .pipe(retry(1), catchError(this.errorHandler));
  // }
  
  approveManufacturer(userId: String): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve-manufacturer/${userId}`, {})
      .pipe(retry(1), catchError(this.errorHandler));
  }
  
  // removeManufacturer(userId: string): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/remove-manufacturer/${userId}`, {})
  //     .pipe(retry(1), catchError(this.errorHandler));
  // }
  
  assignAdmin(userId: String): Observable<any> {
    return this.http.post(`${this.baseUrl}/assign-admin-role/${userId}`, {})
      .pipe(retry(1), catchError(this.errorHandler));
  }
  
  removeRole(userId: String, role: String): Observable<any> {
    return this.http.post(`${this.baseUrl}/unassign-role/${userId}/${role}`, {})
      .pipe(retry(1), catchError(this.errorHandler));
  }
  
  deleteUser(userId: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-user/${userId}`, {});
    //.pipe(retry(1), catchError(this.errorHandler));
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
