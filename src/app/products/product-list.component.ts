import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  merge,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { catchError, map, scan, startWith, tap } from 'rxjs/operators';
import { IProduct } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'pm-products',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Input changes, Event emits, bound observable emits
})
export class ProductListComponent implements OnInit, OnDestroy {
  @Input() passed: number = 0; // input parameter from parent
  @Output() emitEvent: EventEmitter<string> = new EventEmitter<string>(); // callback function of parent, return has to be consumed in parent

  pageTitle: string = 'Title';
  products: IProduct[] = [];
  filterSubject = new Subject<number>();
  filterAction$ = this.filterSubject.asObservable();
  products$ = combineLatest([
    this.productService.productsCombined$,
    this.filterAction$.pipe(startWith(0)),
  ]).pipe(
    map(([products, filter]) =>
      products.filter((product) => product.price > filter)
    ),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productService.categories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  errorMessage: string = '';

  filter: string = 'default';
  sub!: Subscription; // ! tells angular we will set the sub to something
  private _display: string = '';

  get display(): string {
    return this._display;
  }

  set display(value: string) {
    //some logic when setting the value of display
    this._display = value;
  }

  addProductSubject = new Subject<IProduct[]>();
  addProductAction$ = this.addProductSubject.asObservable();

  productsWithAdded$ = merge(
    this.productService.products$,
    this.addProductAction$
  ).pipe(scan((acc: IProduct[], value: IProduct[]) => [...acc, ...value]));

  // injected services (ActivatedRoute: for reading url, Router: for navigating to route with code )
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // On mount
  ngOnInit(): void {
    // PRODUCTS WITH OBSERVABLE
    //this.Mockproducts = this.productService.getProductsMock();
    // this.sub = this.productService.getProducts().subscribe({
    //   next: (products) => (this.products = products),
    //   error: (err) => (this.errorMessage = err),
    // }); // declare subscription to an observable
    // console.log(this.route.snapshot.paramMap.get('id')); // get id from url, must match param declared in route
    // this.route.paramMap.subscribe((params) => console.log(params.get('id'))); // if param changes whithout leaving the page, then a subscription is required to track the changes
  }
  // On dismount
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onClickHandler = (): void => {
    this.emitEvent.emit('passed from child to parent'); // triggers callback function of parent
    this.router.navigate(['/home']);
  };

  filterClicked(event$: any) {
    this.filterSubject.next(event$);
  }

  addProd() {
    this.addProductSubject.next([{ id: 6, price: 6, name: 'added' }]);
  }

  // Combining stream
  // -combineLatest => emits an array of latest values when any stream emits, shape is always === stream count
  // -forkJoin => last emitted value of all input streams, only called when all streams have completed
  // -withLatestFrom => when the source stream emits, emits an array of latest elements, shape is always === stream count
  // -merge => merges multiple streams into 1 stream
  // -scan
}
