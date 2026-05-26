import { configureStore } from '@reduxjs/toolkit';
import { moviesApi } from './movies';
import { authApi } from './auth';

export const store = configureStore({
  reducer: {
    [moviesApi.reducerPath]: moviesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(moviesApi.middleware)
      .concat(authApi.middleware),
});
