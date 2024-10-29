import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { OrderResponse } from '../types/order';
import { PageResponse } from '../types/page';

interface OrderSliceData {
  loading: boolean;
  orders: OrderResponse[] | null;
  userOrders: OrderResponse[] | null;
  pageOrdersResponse: PageResponse | null;
  pageUserOrdersResponse: PageResponse | null;
}

const initialState: OrderSliceData = {
  loading: false,
  orders: null,
  userOrders: null,
  pageOrdersResponse: null,
  pageUserOrdersResponse: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoadingOrders: (state) => {
      state.loading = true;
    },
    setUserOrders: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        console.log('redux user order: ' + action.payload.ordersUser);
        state.pageUserOrdersResponse = action.payload.page;
        state.userOrders = action.payload.page.first
          ? action.payload.ordersUser
          : [...state.userOrders!, ...action.payload.ordersUser];
      }
    },
    setOrders: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        state.pageOrdersResponse = action.payload.page;
        state.orders = action.payload.page.first
          ? action.payload.orders
          : [...state.orders!, ...action.payload.orders];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setLoadingOrders, setUserOrders, setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
