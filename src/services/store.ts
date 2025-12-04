import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice.ts';
import ingredientsReducer from './ingredients-slice.ts';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
