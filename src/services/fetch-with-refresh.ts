import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@utils/types';

import { refreshToken as refreshTokenThunk, logoutUser } from './api';
import { getLocal, setLocal } from './auth-slice';
import { store } from './store';

export async function fetchWithRefresh<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = getLocal<string>(ACCESS_TOKEN_NAME);
  const refreshToken = getLocal<string>(REFRESH_TOKEN_NAME);

  // ----- 1. Изначальный запрос -----
  const tryRequest = async (): Promise<Response> => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
        Authorization: accessToken ?? '',
      },
    });
  };

  let response = await tryRequest();

  // Если НЕ 401 — вернём результат как есть
  if (response.status !== 401) return (await response.json()) as T;

  // ----- 2. Refresh token -----
  if (!refreshToken) {
    void store.dispatch(logoutUser(''));
    throw new Error('Требуется авторизация');
  }

  const refreshResult = await store.dispatch(refreshTokenThunk(refreshToken));

  // refresh не удалось → logout
  if (!refreshResult.payload || typeof refreshResult.payload === 'string') {
    void store.dispatch(logoutUser(refreshToken));
    throw new Error('Сессия истекла, войдите снова');
  }

  const newAccess = refreshResult.payload.accessToken;
  const newRefresh = refreshResult.payload.refreshToken;

  // Сохраняем в localStorage
  setLocal(ACCESS_TOKEN_NAME, newAccess, { expires: 1200 });
  setLocal(REFRESH_TOKEN_NAME, newRefresh);

  // ----- 3. Повторим исходный запрос -----
  response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
      Authorization: newAccess,
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка ${response.status}`);
  }

  return (await response.json()) as T;
}
