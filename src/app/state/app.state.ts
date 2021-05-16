import { ProductState } from '../products/state/product.reducer';

export interface State {
  //products: ProductState; cannot add here because it breaks the lazy loading => instead extend interface in products component
  users: any;
}
