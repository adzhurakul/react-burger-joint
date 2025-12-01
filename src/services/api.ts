import { createAsyncThunk } from '@reduxjs/toolkit';

import type {
  FetchApiResponse,
  CreateOrderResponse,
  TIngredient,
  ResetPasswordResponse,
} from '@utils/types.ts';

const BASE_URL = 'https://norma.education-services.ru/api';
const INGREDIENTS_URL = `${BASE_URL}/ingredients`;
const ORDER_URL = `${BASE_URL}/orders`;
const RESET_PASSWORD_URL = `${BASE_URL}/password-reset`;

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse, // успешный ответ
  string, // аргумент: email
  { rejectValue: string }
>('resetPassword', async (email, { rejectWithValue }) => {
  try {
    const response = await fetch(RESET_PASSWORD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = await checkResponse<ResetPasswordResponse>(response);
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
