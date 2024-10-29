import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { CategoryResponse } from '../types/category';
import { PageResponse } from '../types/page';

interface CategorySliceData {
  loading: boolean;
  categories: CategoryResponse[] | null;
  pageResponse: PageResponse | null;
}

const initialState: CategorySliceData = {
  loading: false,
  categories: null,
  pageResponse: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setLoadingCategory: (state) => {
      state.loading = true;
    },
    setCategories: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        state.pageResponse = action.payload.page;
        state.categories = action.payload.page.first
          ? action.payload.categories
          : [...state.categories!, ...action.payload.categories];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setLoadingCategory, setCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
