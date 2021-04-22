import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    selector: 'pm-products',
    templateUrl: './product-list.component.html',
    styleUrls: ['/product-list.component.css']
})
export class ProductListComponent implements OnInit {
    constructor(private productService: ProductService) {}

    @Input() passed: number = 0;
    @Output() emitEvent: EventEmitter<string> = new EventEmitter<string>();

    ngOnInit(): void {
        this.products = this.productService.getProducts();
    }

    pageTitle: string = "Title";
    products: IProduct[] = [];
    filter: string = "default";
    private _display: string = '';

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        //some logic when setting the value of display
        this._display = value;
    }

    onClickHandler = (): void => {
        this.emitEvent.emit("passed from child to parent")
    } 
}