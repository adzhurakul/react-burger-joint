import { createAction, createSlice } from '@reduxjs/toolkit';

import { fetchOrder } from '@services/api.ts';
import { type IWSOrdersPayload, type TWSOrder, WebsocketStatus } from '@utils/types.ts';

import type { PayloadAction } from '@reduxjs/toolkit';

type FeedState = {
  status: WebsocketStatus;
  connectionError: string | null;
  orders: TWSOrder[];
  currentOrder: TWSOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: FeedState = {
  status: WebsocketStatus.OFFLINE,
  connectionError: null,
  orders: [],
  currentOrder: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.status = WebsocketStatus.CONNECTING;
    },
    wsOpen: (state) => {
      state.status = WebsocketStatus.ONLINE;
      state.connectionError = null;
    },
    wsClose: (state) => {
      state.status = WebsocketStatus.OFFLINE;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.connectionError = action.payload;
    },
    wsMessage: (state, action: PayloadAction<IWSOrdersPayload>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    setCurrentOrder: (state, action: PayloadAction<TWSOrder | null>) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export default feedSlice;

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage, setCurrentOrder } =
  feedSlice.actions;

export type TWsInternalActions = ReturnType<
  (typeof feedSlice.actions)[keyof typeof feedSlice.actions]
>;

export const wsConnect = createAction<string, 'FEED_CONNECT'>('FEED_CONNECT');

export const wsDisconnect = createAction('FEED_DISCONNECT');

export type TWsExternalActions =
  | ReturnType<typeof wsConnect>
  | ReturnType<typeof wsDisconnect>;
