import { Injectable } from "@angular/core";
import { IProduct } from "./product";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class ProductService {
    private URL = '/api/items';

    constructor(private http : HttpClient) {}
    
    getProductsMock = (): IProduct[] => {
        return [{name: "a", price: 5}, {name: "b", price: 6}]
    }

    getProducts = (): Observable<IProduct[]> => {
        return this.http.get<IProduct[]>(this.URL)
        .pipe(
            tap(data => console.log(JSON.stringify(data))),
            catchError(this.handleError)
        );
    }

    private handleError = (err: HttpErrorResponse) => {
        console.log(err.error.message);
        return throwError(err.error.message);
    }
}