import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    selector: 'pm-products',
    templateUrl: './product-list.component.html',
    styleUrls: ['/product-list.component.css']
})
export class ProductListComponent implements OnInit,OnDestroy {
    constructor(private productService: ProductService) {}

    @Input() passed: number = 0;
    @Output() emitEvent: EventEmitter<string> = new EventEmitter<string>();
    
    pageTitle: string = "Title";
    products: IProduct[] = [];
    errorMessage: string = '';
    Mockproducts: IProduct[] = [];
    filter: string = "default";
    sub!: Subscription;
    private _display: string = '';

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        //some logic when setting the value of display
        this._display = value;
    }

    ngOnInit(): void {
        this.Mockproducts = this.productService.getProductsMock();
        this.sub = this.productService.getProducts().subscribe(
            {
                next: products => this.products = products,
                error: err => this.errorMessage = err
            }
        );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onClickHandler = (): void => {
        this.emitEvent.emit("passed from child to parent")
    } 
}