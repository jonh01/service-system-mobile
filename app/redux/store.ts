import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import authSlice from './authSlice';
import categoriesSlice from './categorySlice';
import orderSlice from './orderSlice';
import ratingSlice from './ratingSlice';
import servicesSlice from './serviceSlice';
import themeSlice from './themeSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['services', 'categories', 'ratings', 'orders'],
};

const persistedAuthReducer = persistReducer(persistConfig, authSlice);
const persistedThemeReducer = persistReducer(persistConfig, themeSlice);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    theme: persistedThemeReducer,
    services: servicesSlice,
    categories: categoriesSlice,
    ratings: ratingSlice,
    orders: orderSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
