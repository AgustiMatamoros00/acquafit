import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = ''; // No prefix needed since we're using proxy

  constructor(private http: HttpClient) { }

  // GET request
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // POST request
  post<T>(endpoint: string, data: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<T>(`${this.apiUrl}${endpoint}`, data, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // PUT request
  put<T>(endpoint: string, data: any): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.put<T>(`${this.apiUrl}${endpoint}`, data, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // DELETE request
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
} 