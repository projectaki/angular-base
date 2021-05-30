import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { IProduct } from './product';
import { ProductListComponent } from './product-list.component';
import { ProductService } from './product.service';

describe('Shallow test', () => {
  let fixture: ComponentFixture<ProductListComponent>; // wrapper for component (some additional features)
  let mockProductService: any;
  let mockRoute;
  let mockRouter;
  let mockStore;

  beforeEach(() => {
    mockProductService = jasmine.createSpyObj(['createProduct']); //creates a mock object with given method names
    mockProductService.categories$ = of([1]);
    mockRoute = jasmine.createSpyObj(['test']); //creates a mock object with given method names
    mockRouter = jasmine.createSpyObj(['test']); //creates a mock object with given method names
    mockStore = jasmine.createSpyObj(['select', 'dispatch']); //creates a mock object with given method names
    mockStore.select.and.returnValue(
      of([{ id: 9, price: 6, name: 'added' } as IProduct])
    );
    mockStore.dispatch.and.returnValue(
      from([{ id: 9, price: 6, name: 'added' } as IProduct])
    );
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ProductListComponent);
  });

  it('should have a prod', () => {
    fixture.componentInstance.products = [
      { id: 9, price: 6, name: 'added' } as IProduct,
    ];
    expect(fixture.componentInstance.products.length).toBe(1);
  });

  it('should render in div', () => {
    fixture.componentInstance.products = [
      { id: 9, price: 6, name: 'added' } as IProduct,
    ];
    fixture.componentInstance.test$ = of([
      { id: 9, price: 6, name: 'added' } as IProduct,
    ]);
    fixture.detectChanges();
    const elem = fixture.nativeElement.querySelector('#prod-div');
    expect(elem.textContent).toContain('added');
  });

  // FOR ASYNC WRAP THE IT CALLBACK WITH fakeAsync, and use tick(ms)/flush() to turn async into sync, executing all async funcs instantly
});
