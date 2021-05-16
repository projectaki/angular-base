import { createAction, props } from '@ngrx/store';
import { IProduct } from '../../product';

export const loadProductsSuccess = createAction(
  '[Load] Load Success',
  props<{ products: IProduct[] }>()
);
// called in reducer
export const loadProductsFailure = createAction(
  '[Load] Load Failure',
  props<{ error: string }>()
);

export const updateProductSuccess = createAction(
  '[Product] Update product success',
  props<{ product: IProduct }>()
);

export const updateProductFailure = createAction(
  '[Product] Update product failure',
  props<{ error: string }>()
);
