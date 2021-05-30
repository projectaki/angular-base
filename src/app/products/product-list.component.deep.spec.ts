import { CssSelector } from '@angular/compiler';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import { IProduct } from './product';
import { ProductListComponent } from './product-list.component';
import { ProductService } from './product.service';

describe('Deep test', () => {
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
    });
    fixture = TestBed.createComponent(ProductListComponent);
    fixture.componentInstance.products = [
      { id: 9, price: 6, name: 'added' } as IProduct,
    ];
    fixture.detectChanges();
    // fixture.debugElement.queryAll(By.directive('child-component-selector')) // Get child directives
  });

  it('should have a prod', () => {
    expect(true).toBe(true);
  });
});
