import { createAsyncThunk } from '@reduxjs/toolkit';

import { setLocal } from '@services/auth-slice.ts';
import { fetchWithRefresh } from '@services/fetch-with-refresh.ts';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@utils/types.ts';

import type {
  AuthResponse,
  CreateOrderResponse,
  FetchApiResponse,
  LoginRequest,
  LogoutResponse,
  RegisterUserRequest,
  SuccessMessageResponse,
  TIngredient,
  TokenRefreshResponse,
} from '@utils/types.ts';

const BASE_URL = 'https://norma.education-services.ru/api';
const INGREDIENTS_URL = `${BASE_URL}/ingredients`;
const ORDER_URL = `${BASE_URL}/orders`;

const FORGOT_PASSWORD_URL = `${BASE_URL}/password-reset`;
const RESET_PASSWORD_URL = `${BASE_URL}/password-reset/reset`;

const REGISTER_USER_URL = `${BASE_URL}/auth/register`;
const LOGIN_URL = `${BASE_URL}/auth/login`;
const LOGOUT_URL = `${BASE_URL}/auth/logout`;
const REFRESH_TOKEN_URL = `${BASE_URL}/auth/token`;
const USER_URL = `${BASE_URL}/auth/user`;

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }
  return (await res.json()) as Promise<T>;
}

export const updateUser = createAsyncThunk<
  AuthResponse,
  { name?: string; email?: string; password?: string },
  { rejectValue: string }
>('auth/updateUser', async (body, { rejectWithValue }) => {
  try {
    return await fetchWithRefresh<AuthResponse>(USER_URL, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const getUser = createAsyncThunk<AuthResponse, string, { rejectValue: string }>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchWithRefresh<AuthResponse>(USER_URL, { method: 'GET' });
    } catch (err: unknown) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/loginUser', async (request, { rejectWithValue }) => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data = (await response.json()) as AuthResponse;

    // побочный эффект — токены сохраняем в thunk
    setLocal(ACCESS_TOKEN_NAME, data.accessToken, { expires: 1200 });
    setLocal(REFRESH_TOKEN_NAME, data.refreshToken);

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

// REGISTER
export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterUserRequest,
  { rejectValue: string }
>('auth/registerUser', async (request, { rejectWithValue }) => {
  try {
    const response = await fetch(REGISTER_USER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const data = (await response.json()) as AuthResponse;

    setLocal(ACCESS_TOKEN_NAME, data.accessToken, { expires: 1200 });
    setLocal(REFRESH_TOKEN_NAME, data.refreshToken);

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

// REFRESH TOKEN
export const refreshToken = createAsyncThunk<
  TokenRefreshResponse,
  string,
  { rejectValue: string }
>('auth/refreshToken', async (refreshTokenValue, { rejectWithValue }) => {
  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshTokenValue }),
    });
    const data = (await response.json()) as TokenRefreshResponse;

    setLocal(ACCESS_TOKEN_NAME, data.accessToken, { expires: 1200 });
    setLocal(REFRESH_TOKEN_NAME, data.refreshToken);

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk<
  LogoutResponse,
  string,
  { rejectValue: string }
>('auth/logoutUser', async (refreshTokenValue, { rejectWithValue }) => {
  try {
    const response = await fetch(LOGOUT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshTokenValue }),
    });
    const data = (await response.json()) as LogoutResponse;

    // Очистка localStorage при выходе
    setLocal(ACCESS_TOKEN_NAME, '');
    setLocal(REFRESH_TOKEN_NAME, '');

    return data;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const forgotPassword = createAsyncThunk<
  SuccessMessageResponse,
  string,
  { rejectValue: string }
>('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await fetch(FORGOT_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await checkResponse<SuccessMessageResponse>(response);
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const resetPassword = createAsyncThunk<
  SuccessMessageResponse,
  {
    password: string;
    token: string;
  },
  { rejectValue: string }
>('auth/resetPassword', async (passwordAndToken, { rejectWithValue }) => {
  try {
    const response = await fetch(RESET_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordAndToken),
    });

    return await checkResponse<SuccessMessageResponse>(response);
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const json = await fetch(INGREDIENTS_URL).then(checkResponse<FetchApiResponse>);
    return json.data;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const createOrder = createAsyncThunk<
  { id: number; ingredients: TIngredient[] },
  string[],
  { rejectValue: string }
>('ingredients/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const json = await fetchWithRefresh<CreateOrderResponse>(ORDER_URL, {
      method: 'POST',
      body: JSON.stringify({ ingredients: ingredientIds }),
    });

    return {
      id: json.order.number,
      ingredients: ingredientIds.map((id) => ({ _id: id }) as TIngredient),
    };
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});
