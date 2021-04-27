import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { IProduct } from "./product";
import { ProductService } from "./product.service";

@Component({
    selector: 'pm-products',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit,OnDestroy {
    // injected services (ActivatedRoute: for reading url, Router: for navigating to route with code )
    constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

    @Input() passed: number = 0; // input parameter from parent
    @Output() emitEvent: EventEmitter<string> = new EventEmitter<string>(); // callback function of parent, return has to be consumed in parent
    
    pageTitle: string = "Title";
    products: IProduct[] = [];
    errorMessage: string = '';
    Mockproducts: IProduct[] = [];
    filter: string = "default";
    sub!: Subscription; // ! tells angular we will set the sub to something
    private _display: string = '';

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        //some logic when setting the value of display
        this._display = value;
    }
    // On mount
    ngOnInit(): void {
        this.Mockproducts = this.productService.getProductsMock();
        this.sub = this.productService.getProducts().subscribe(
            {
                next: products => this.products = products,
                error: err => this.errorMessage = err
            }
        ); // declare subscription to an observable
        console.log(this.route.snapshot.paramMap.get('id')); // get id from url, must match param declared in route
        this.route.paramMap.subscribe(
            params => console.log(params.get('id'))
        ); // if param changes whithout leaving the page, then a subscription is required to track the changes
    }
    // On dismount
    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onClickHandler = (): void => {
        this.emitEvent.emit("passed from child to parent") // triggers callback function of parent
        this.router.navigate(['/home']);
    } 
}