import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

import { UserResponse } from '../types/user';

interface AuthSliceData {
  signed: boolean;
  user: UserResponse | null;
  token: string | null;
}

const initialState: AuthSliceData = {
  signed: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    signIn: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.tokens;
      state.signed = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setUser, setToken, signIn } = authSlice.actions;

export default authSlice.reducer;
