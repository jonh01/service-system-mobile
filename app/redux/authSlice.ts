import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { UserResponse } from '../types/user';

interface AuthSliceData {
  signed: boolean;
  user: UserResponse | null;
  googleToken: string | null;
}

const initialState: AuthSliceData = {
  signed: false,
  user: null,
  googleToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setGoogleToken: (state, action) => {
      state.googleToken = action.payload;
    },
    signIn: (state, action) => {
      state.user = action.payload.user;
      state.googleToken = action.payload.googleToken;
      state.signed = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setUser, setGoogleToken, signIn } = authSlice.actions;

export default authSlice.reducer;
