import { Injectable } from '@angular/core';
import { IProduct } from './product';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // scope where it is available
})
export class ProductService {
  private URL = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  // returns an observable
  getProducts = (): Observable<IProduct[]> => {
    return this.http.get<IProduct[]>(this.URL).pipe(
      tap((data) => console.log(JSON.stringify(data))), // tap into the data, and do something (logging)
      catchError(this.handleError) // error handling operator
    ); // pipe into the observable
  };

  getProduct = (id: number): Observable<IProduct> => {
    const url = `${this.URL}/${id}`;
    return this.http.get<IProduct>(url);
  };

  updateProduct = (product: IProduct): Observable<IProduct> => {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url = `${this.URL}/${product.id}`;
    return this.http.put<IProduct>(url, product, { headers: headers });
  };

  private handleError = (err: HttpErrorResponse) => {
    console.log(err.error.message);
    return throwError(err.error.message);
  };
}
