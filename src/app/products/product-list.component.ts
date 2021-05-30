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
import { Store } from '@ngrx/store';
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
import {
  catchError,
  map,
  scan,
  shareReplay,
  startWith,
  tap,
} from 'rxjs/operators';
import { IProduct } from './product';
import { ProductService } from './product.service';

import { ProductPageActions } from './state/actions';
import { getProducts, getShow, State } from './state';
@Component({
  selector: 'pm-products',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Input changes, Event emits, bound observable emits
})
export class ProductListComponent {
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

  test$!: Observable<IProduct[]>;

  categories$ = this.productService.categories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  errorMessage: string = '';

  filter: string = 'default';
  sub: Subscription = new Subscription(); // ! tells angular we will set the sub to something
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

  toggled: boolean = false;

  // injected services (ActivatedRoute: for reading url, Router: for navigating to route with code )
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>
  ) {}

  // On mount
  ngOnInit(): void {
    this.sub.add(
      this.store.select(getShow).subscribe((show) => (this.toggled = show))
    );
    this.test$ = this.store
      .select(getProducts)
      .pipe(tap((data) => console.log('HEERE', data)));
    this.store.dispatch(ProductPageActions.loadProducts());
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
    const newProd: IProduct = { id: 9, price: 6, name: 'added' };
    this.products = [...this.products, newProd];
    this.productService
      .createProduct(newProd)
      .subscribe(() => this.addProductSubject.next([newProd]));
  }

  toggleHandler() {
    this.store.dispatch(ProductPageActions.toggleShow());
  }

  setProductsHandler(products: IProduct[]) {
    this.store.dispatch(ProductPageActions.setProducts({ products }));
  }

  setCurrentProduct(product: IProduct) {
    this.store.dispatch(
      ProductPageActions.setCurrentProduct({ productId: product.id })
    );
  }

  // Combining stream
  // -combineLatest => emits an array of latest values when any stream emits, shape is always === stream count
  // -forkJoin => last emitted value of all input streams, only called when all streams have completed
  // -withLatestFrom => when the source stream emits, emits an array of latest elements, shape is always === stream count
  // -merge => merges multiple streams into 1 stream
  // -scan => like reducer, has an accumulator and returns the accumulated result

  // HIGHER ORDER MAPPING
  // -concatMap => each emitted item to a new inner observable, syncronous, concats the results
  // -mergeMap => each emitted item to new inner observable, asyncronous, merges the result (same as concat, but order isnt garanteed)
  // -switchMap => each emitted item to new inner observable, stops the previous emit, and continues with the current one, merges result to output stream
}
