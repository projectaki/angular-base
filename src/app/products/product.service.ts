import { Injectable } from '@angular/core';
import { IProduct } from './product';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  shareReplay,
  tap,
  toArray,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root', // scope where it is available
})
export class ProductService {
  private URL = 'http://localhost:3000/products';

  products$ = this.http.get<IProduct[]>(this.URL).pipe(
    map((products) =>
      products.map((product) => ({ ...product, price: 999 } as IProduct))
    ),
    tap((data) => console.log('rerun')),
    catchError(this.handleError)
  );

  categories$ = of([500, 1000, 1500]);
  productsCombined$ = combineLatest([this.products$, this.categories$]).pipe(
    tap(([products, categories]) =>
      console.log('TAPPED', products, categories)
    ),
    map(([products, categories]) =>
      products.map(
        (product, idx) => ({ ...product, price: categories[idx] } as IProduct)
      )
    )
    // shareReplay(1) // caches the observable if multiple things subscribe to it, it will onyl load once
  );

  higherOrderProducts$ = of(1, 3).pipe(
    concatMap((id) => this.http.get<IProduct>(`${this.URL}/${id}`))
    // toArray() if we need it to emit 1 array
  );

  constructor(private http: HttpClient) {
    this.higherOrderProducts$.subscribe((data) => console.log('HO', data));
  }

  // // returns an observable
  // getProducts = (): Observable<IProduct[]> => {
  //   return this.http.get<IProduct[]>(this.URL).pipe(
  //     tap((data) => console.log(JSON.stringify(data))), // tap into the data, and do something (logging)
  //     // catchError((error) => {
  //     //   return of([{ id: 1, name: 'name', price: 5 }]); // if error we ca nreturn a new observer (maybe from cache)
  //     // }),
  //     catchError(this.handleError) // catch and rethrow
  //   ); // pipe into the observable
  // };

  getProduct = (id: number): Observable<IProduct> => {
    const url = `${this.URL}/${id}`;
    return this.http.get<IProduct>(url);
  };

  updateProduct = (product: IProduct): Observable<IProduct> => {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const url = `${this.URL}/${product.id}`;
    return this.http.put<IProduct>(url, product, { headers: headers });
  };

  // catch and rethrow error further up the chain
  handleError(err: HttpErrorResponse) {
    console.log('error', err.message);
    return throwError(err.message);
  }
}
