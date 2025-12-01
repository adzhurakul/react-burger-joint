import { createAsyncThunk } from '@reduxjs/toolkit';

import type {
  FetchApiResponse,
  CreateOrderResponse,
  TIngredient,
  RegisterUserRequest,
  SuccessMessageResponse,
  AuthResponse,
  LoginRequest,
  TokenRefreshResponse,
  LogoutResponse,
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

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const logoutUser = createAsyncThunk<
  LogoutResponse,
  string,
  { rejectValue: string }
>('auth/logoutUser', async (refreshTokenValue, { rejectWithValue }) => {
  try {
    const response = await fetch(LOGOUT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshTokenValue }),
    });

    const json = await checkResponse<LogoutResponse>(response);
    return json;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const refreshToken = createAsyncThunk<
  TokenRefreshResponse,
  string,
  { rejectValue: string }
>('auth/refreshToken', async (refreshTokenValue, { rejectWithValue }) => {
  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshTokenValue }),
    });

    const json = await checkResponse<TokenRefreshResponse>(response);
    return json;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('registerUser', async (request, { rejectWithValue }) => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request }),
    });

    const json = await checkResponse<AuthResponse>(response);
    return json;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterUserRequest,
  { rejectValue: string }
>('registerUser', async (request, { rejectWithValue }) => {
  try {
    const response = await fetch(REGISTER_USER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ request }),
    });

    const json = await checkResponse<AuthResponse>(response);
    return json;
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const forgotPassword = createAsyncThunk<
  SuccessMessageResponse,
  string, // аргумент: email
  { rejectValue: string }
>('forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await fetch(FORGOT_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await checkResponse<SuccessMessageResponse>(response);
    return json;
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
>('resetPassword', async (passwordAndToken, { rejectWithValue }) => {
  try {
    const response = await fetch(RESET_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordAndToken),
    });

    const json = await checkResponse<SuccessMessageResponse>(response);
    return json;
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
    const json = await fetch(ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientIds }),
    }).then(checkResponse<CreateOrderResponse>);

    return {
      id: json.order.number,
      ingredients: ingredientIds.map((id) => ({ _id: id }) as TIngredient),
    };
  } catch (err: unknown) {
    if (err instanceof Error) return rejectWithValue(err.message);
    return rejectWithValue('Неизвестная ошибка');
  }
});
