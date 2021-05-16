import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as AppState from '../../state/app.state';

import { ProductState } from './product.reducer';

// Required if this module is leazy loaded
export interface State extends AppState.State {
  products: ProductState;
}

const getSliceProductState = createFeatureSelector<ProductState>('products');

export const getShow = createSelector(
  getSliceProductState,
  (state) => state.show
);

export const getCurrentProductId = createSelector(
  getSliceProductState,
  (state) => state.currentProductId
);

export const getCurrentProduct = createSelector(
  getSliceProductState,
  getCurrentProductId,
  (state, prodId) =>
    prodId ? state.products.find((p) => p.id === prodId) : null
);

export const getProducts = createSelector(
  getSliceProductState,
  (state) => state.products
);

export const getError = createSelector(
  getSliceProductState,
  (state) => state.error
);
