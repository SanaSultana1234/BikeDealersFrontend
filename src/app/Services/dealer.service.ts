import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { DealerModel } from '../models/data/dealer-model';


@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private baseUrl = 'https://localhost:7273/api/Dealers';
  constructor(private http: HttpClient) { }

  getDealerCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  getDealers(): Observable<DealerModel[]> {
    return this.http.get<DealerModel[]>(this.baseUrl)
            .pipe(retry(1), catchError(this.errorHandler));
  }

  getDealersByName(name: string): Observable<DealerModel[]> {
    return this.http.get<DealerModel[]>(`${this.baseUrl}/search?name=${name}`)
      .pipe(retry(1), catchError(this.errorHandler));
  }

  getDealerByUserId(userId: string) {
    return this.http.get<DealerModel>(`${this.baseUrl}/${userId}`);
  }

  updateDealer(id: any, dealer: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, dealer);
  }

  deleteDealer(id: any): Observable<any> {
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
