import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { DealerMasterModel } from '../models/data/dealer-master-model';

@Injectable({
  providedIn: 'root'
})
export class DealerMasterService {
  private baseUrl = 'https://localhost:7273/api/DealerMasters';
  constructor(private http: HttpClient) { }

  getDMs(): Observable<DealerMasterModel[]> {
    return this.http.get<DealerMasterModel[]>(this.baseUrl)
            .pipe(retry(1), catchError(this.errorHandler));
  }

  addDM(dm: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dm);
  }

  updateDM(id: Number, dm: DealerMasterModel): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, dm);
  }
  
  deleteDM(id: Number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
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
