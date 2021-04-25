import { TestBed } from '@angular/core/testing';

import { ProductListGuard } from './product-list.guard';

describe('ProductListGuard', () => {
  let guard: ProductListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProductListGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
