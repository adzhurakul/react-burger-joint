import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';

import { socketMiddleware } from '@services/soket-middleware.ts';

import authSlice from './auth-slice.ts';
import {
  feedSlice,
  wsClose,
  wsConnecting,
  wsError,
  wsMessage,
  wsOpen,
  wsConnect,
  wsDisconnect,
} from './feed-slice.ts';
import ingredientsSlice from './ingredients-slice.ts';

import type { TWsInternalActions, TWsExternalActions } from './feed-slice.ts';
import type { ThunkDispatch } from '@reduxjs/toolkit';
import type { TAuthInternalActions } from '@services/auth-slice.ts';
import type { TIngredientsInternalActions } from '@services/ingredients-slice.ts';

const feedMiddleware = socketMiddleware({
  connect: wsConnect,
  disconnect: wsDisconnect,
  onConnecting: wsConnecting,
  onOpen: wsOpen,
  onClose: wsClose,
  onError: wsError,
  onMessage: wsMessage,
});

const rootReducer = combineReducers({
  [feedSlice.reducerPath]: feedSlice.reducer,
  [ingredientsSlice.reducerPath]: ingredientsSlice.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(feedMiddleware);
  },
});

type TApplicationActions =
  | TWsExternalActions
  | TWsInternalActions
  | TIngredientsInternalActions
  | TAuthInternalActions;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, TApplicationActions>;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();
