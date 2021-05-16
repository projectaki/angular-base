import { createAction, props } from '@ngrx/store';
import { IProduct } from '../../product';

export const toggleShow = createAction('[Product Page] Toggle Product Code');
export const setProducts = createAction(
  '[Products] Set current Products',
  props<{ products: IProduct[] }>()
);
export const setCurrentProduct = createAction(
  '[Product Page] Set current product',
  props<{ productId: number }>()
);

// For complex calls we define 3 actions
// called in effects
export const loadProducts = createAction('[Load] Load');
// called in reducer

export const updateProduct = createAction(
  '[Product Page] Update product',
  props<{ product: IProduct }>()
);
