import { createReducer, on } from '@ngrx/store';
import { IProduct } from '../product';
import { ProductPageActions, ProductApiActions } from './actions';

export interface ProductState {
  show: boolean;
  currentProductId: number | null;
  products: IProduct[];
  error: string;
}

const initialState: ProductState = {
  show: true,
  currentProductId: null,
  products: [],
  error: '',
};

export const productReducer = createReducer<ProductState>(
  initialState, //initial state
  on(ProductPageActions.toggleShow, (state): ProductState => {
    console.log('original state' + JSON.stringify(state));

    return {
      ...state,
      show: !state.show,
      error: '',
    };
  }),
  on(ProductPageActions.setCurrentProduct, (state, action) => {
    return {
      ...state,
      currentProductId: action.productId,
    };
  }),
  on(ProductPageActions.setProducts, (state, action): ProductState => {
    console.log('original state' + JSON.stringify(state));

    return {
      ...state,
      products: action.products,
    };
  }),
  on(ProductApiActions.loadProductsSuccess, (state, action): ProductState => {
    return { ...state, products: action.products };
  }),
  on(ProductApiActions.loadProductsFailure, (state, action) => {
    return {
      ...state,
      products: [],
      error: action.error,
    };
  }),
  on(ProductApiActions.updateProductSuccess, (state, action): ProductState => {
    const updatedProducts = state.products.map((item) =>
      action.product.id === item.id ? action.product : item
    );
    return {
      ...state,
      products: updatedProducts,
      currentProductId: action.product.id,
      error: '',
    };
  }),
  on(ProductApiActions.updateProductFailure, (state, action) => {
    return {
      ...state,
      products: [],
      error: action.error,
    };
  })
);
