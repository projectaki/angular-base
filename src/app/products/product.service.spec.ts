import { inject, TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('Product service test', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // service = new ProductService();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    httpTestingController = TestBed.get(HttpTestingController);
  });
  it('testing hhtp', inject(
    [ProductService, HttpTestingController],
    (service: ProductService, http: HttpTestingController) => {
      service.getProduct(1).subscribe();

      const req = http.expectOne('http://localhost:3000/products/1');
      req.flush({ id: 1, name: 'whatever', price: 5 });
      http.verify();
    }
  ));
});
