import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { BikeModel } from '../models/data/bike-model';

@Injectable({
  providedIn: 'root'
})
export class BikeService {
  private baseUrl = 'https://localhost:7273/api/Bikes'; 
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  getBikes(): Observable<BikeModel[]> {
    return this.http.get<BikeModel[]>(this.baseUrl)
      .pipe(
        retry(1), // retry once before failing
        catchError(this.errorHandler)
      );
  }

  addBike(bike: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, bike);
  }

  updateBike(id: Number, bike: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, bike);
  }

  deleteBike(id: Number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
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
