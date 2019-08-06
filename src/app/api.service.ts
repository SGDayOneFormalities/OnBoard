import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Employee } from './employee.interface';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/v1/employee";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead
  
  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
  // getEmployee(id): Observable<Employee> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.get<Employee>(url).pipe(
  //     tap(_ => console.log(`fetched employee id=${id}`)),
  //     catchError(this.handleError<Employee>(`getEmployee id=${id}`))
  //   );
  // }
  
  // addEmployee (employee): Observable<Employee> {
  //   return this.http.post<Employee>(apiUrl, employee, httpOptions).pipe(
  //     tap((employee: Employee) => console.log(`added employee w/ id=${employee.id}`)),
  //     catchError(this.handleError<Employee>('addEmployee'))
  //   );
  // }
  
  // updateEmployee (id, employee): Observable<any> {
  //   const url = `${apiUrl}/${id}`;
  //   return this.http.put(url, employee, httpOptions).pipe(
  //     tap(_ => console.log(`updated employee id=${id}`)),
  //     catchError(this.handleError<any>('updateEmployee'))
  //   );
  // }
  
  // deleteEmployee (id): Observable<Employee> {
  //   const url = `${apiUrl}/${id}`;
  
  //   return this.http.delete<Employee>(url, httpOptions).pipe(
  //     tap(_ => console.log(`deleted employee id=${id}`)),
  //     catchError(this.handleError<Employee>('deleteEmployee'))
  //   );
  // }
}
