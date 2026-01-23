import { wsConnect } from '@services/feed-slice.ts';
import { fetchWithRefresh } from '@services/fetch-with-refresh.ts';

import type { RootState } from './store.ts';
import type {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from '@reduxjs/toolkit';
import type { AuthResponse } from '@utils/types.ts';

export type TWsActionTypes<R, S extends { message?: string }> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  sendMessage?: ActionCreatorWithPayload<R>;
  onConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onClose: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<S>;
};

const RECONNECT_PERIOD = 3000;

export const socketMiddleware = <R, S extends { message?: string }>(
  wsActions: TWsActionTypes<R, S>,
  withTokenRefresh = false
): Middleware<NonNullable<unknown>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const {
      connect,
      sendMessage,
      onOpen,
      onClose,
      onError,
      onMessage,
      onConnecting,
      disconnect,
    } = wsActions;
    let isConnected = false;
    let reconnectTimer = 0;
    let url = '';

    return (next) => (action) => {
      const { dispatch } = store;

      if (connect.match(action)) {
        url = action.payload;
        socket = new WebSocket(url);
        isConnected = true;
        dispatch(onConnecting());

        socket.onopen = (): void => {
          dispatch(onOpen());
        };

        socket.onerror = (): void => {
          dispatch(onError('Error'));
        };

        socket.onmessage = (event: MessageEvent<string>): void => {
          const { data } = event;

          try {
            const parsedData = JSON.parse(data) as S;

            if (withTokenRefresh && parsedData.message === 'Invalid or missing token') {
              fetchWithRefresh<AuthResponse>(url, { method: 'GET' })
                .then((refreshData) => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set(
                    'token',
                    refreshData.accessToken.replace('Bearer ', '')
                  );
                  dispatch(wsConnect(wssUrl.toString()));
                })
                .catch((err) => {
                  dispatch(onError((err as { message: string }).message));
                });

              return;
            }

            dispatch(onMessage(parsedData));
          } catch (error) {
            dispatch(onError((error as { message: string }).message));
          }
        };

        socket.onclose = (): void => {
          dispatch(onClose());

          if (isConnected) {
            reconnectTimer = window.setTimeout(() => {
              dispatch(connect(url));
            }, RECONNECT_PERIOD);
          }
        };
      }

      if (socket && sendMessage?.match(action)) {
        try {
          socket.send(JSON.stringify(action.payload));
        } catch (error) {
          dispatch(onError((error as { message: string }).message));
        }
      }

      if (socket && disconnect.match(action)) {
        clearTimeout(reconnectTimer);
        isConnected = false;
        reconnectTimer = 0;
        socket.close();
        socket = null;
      }

      next(action);
    };
  };
};
