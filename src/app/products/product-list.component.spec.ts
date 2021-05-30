import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';

// Jasmine function, group test together
describe('product list test', () => {
  let component: ProductListComponent;
  let mockProductService: any;
  let mockRoute;
  let mockRouter;
  let mockStore;

  // start with setting common state, by resetting state before all tests
  beforeEach(() => {
    mockProductService = jasmine.createSpyObj(['createProduct']); //creates a mock object with given method names
    mockProductService.categories$ = of([1]);
    mockRoute = jasmine.createSpyObj(['test']); //creates a mock object with given method names
    mockRouter = jasmine.createSpyObj(['test']); //creates a mock object with given method names
    mockStore = jasmine.createSpyObj(['select', 'dispatch']); //creates a mock object with given method names
    component = new ProductListComponent(
      mockProductService,
      mockRoute,
      mockRouter,
      mockStore
    );
  });

  describe('Add product', () => {
    it('should add a product', () => {
      mockProductService.createProduct.and.returnValue(of(true));
      component.addProd();
      expect(component.products.length).toBe(1);
      expect(mockProductService.createProduct).toHaveBeenCalled();
    });
  });
});
