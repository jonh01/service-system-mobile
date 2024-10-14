import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { PageResponse } from '../types/page';
import { RatingResponse } from '../types/rating';

interface RatingSliceData {
  loading: boolean;
  ratings: RatingResponse[] | null;
  pageResponse: PageResponse | null;
}

const initialState: RatingSliceData = {
  loading: false,
  ratings: null,
  pageResponse: null,
};

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setLoadingRating: (state) => {
      state.loading = true;
    },
    setRatings: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        state.pageResponse = action.payload.page;
        state.ratings = action.payload.page.first
          ? action.payload.ratings
          : [...state.ratings!, ...action.payload.ratings];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setLoadingRating, setRatings } = ratingsSlice.actions;

export default ratingsSlice.reducer;
