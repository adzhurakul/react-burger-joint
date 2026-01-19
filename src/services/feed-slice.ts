import { createAction, createSlice } from '@reduxjs/toolkit';

import { type IWSOrdersPayload, type TWSOrder, WebsocketStatus } from '@utils/types.ts';

import type { PayloadAction } from '@reduxjs/toolkit';

export type TFeedMessage = {
  orders: unknown[];
  total: number;
  totalToday: number;
};

type FeedState = {
  status: WebsocketStatus;
  connectionError: string | null;
  orders: TWSOrder[];
  total: number;
  totalToday: number;
};

const initialState: FeedState = {
  status: WebsocketStatus.OFFLINE,
  connectionError: null,
  orders: [],
  total: 0,
  totalToday: 0,
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
  },
});

export const { wsConnecting, wsOpen, wsClose, wsError, wsMessage } = feedSlice.actions;

export type TWsInternalActions = ReturnType<
  (typeof feedSlice.actions)[keyof typeof feedSlice.actions]
>;

export const wsConnect = createAction<string, 'FEED_CONNECT'>('FEED_CONNECT');

export const wsDisconnect = createAction('FEED_DISCONNECT');

export type TWsExternalActions =
  | ReturnType<typeof wsConnect>
  | ReturnType<typeof wsDisconnect>;
