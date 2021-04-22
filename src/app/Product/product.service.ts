import { Injectable } from "@angular/core";
import { IProduct } from "./product";

@Injectable({
    providedIn: "root"
})
export class ProductService {
    
    getProducts = (): IProduct[] => {
        return [{name: "a", price: 5}, {name: "b", price: 6}]
    }
}