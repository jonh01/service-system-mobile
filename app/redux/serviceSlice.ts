import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { PageResponse } from '../types/page';
import { ServiceProvidedSummaryResponse, ServiceProvidedUserResponse } from '../types/service';

interface ServiceSliceData {
  loading: boolean;
  services: ServiceProvidedSummaryResponse[] | null;
  userServices: ServiceProvidedUserResponse[] | null;
  pageResponse: PageResponse | null;
}

const initialState: ServiceSliceData = {
  loading: false,
  services: null,
  userServices: null,
  pageResponse: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setLoadingServices: (state) => {
      state.loading = true;
    },
    setUserServices: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        state.pageResponse = action.payload.page;
        state.userServices = action.payload.page.first
          ? action.payload.userServices
          : [...state.userServices!, ...action.payload.userServices];
      }
    },
    setServices: (state, action) => {
      state.loading = false;
      if (action.payload != null) {
        state.pageResponse = action.payload.page;
        state.services = action.payload.page.first
          ? action.payload.services
          : [...state.services!, ...action.payload.services];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setLoadingServices, setUserServices, setServices } = servicesSlice.actions;

export default servicesSlice.reducer;
