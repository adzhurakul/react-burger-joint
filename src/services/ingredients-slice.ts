import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, ApiResponse, CreateOrderResponse } from '@utils/types';

type ConstructorIngredient = TIngredient & { uniqueId: string };

type IngredientsState = {
  allIngredients: TIngredient[];
  constructorIngredients: ConstructorIngredient[];
  currentIngredient: TIngredient | null;
  createdOrder: { id: number; ingredients: TIngredient[] } | null;
  loading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  allIngredients: [],
  constructorIngredients: [],
  currentIngredient: null,
  createdOrder: null,
  loading: false,
  error: null,
};

const BASE_URL = 'https://norma.education-services.ru/api';

const INGREDIENTS_URL = `${BASE_URL}/ingredients`;
const ORDER_URL = `${BASE_URL}/orders`;

async function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Ошибка: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const json = await fetch(INGREDIENTS_URL).then(checkResponse<ApiResponse>);
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

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredientToConstructor: {
      reducer: (state, action: PayloadAction<TIngredient & { uniqueId: string }>) => {
        state.constructorIngredients.push(action.payload);

        state.constructorIngredients = state.constructorIngredients.sort((a, b) => {
          const isABun = a.type === 'bun';
          const isBBun = b.type === 'bun';

          if (isABun && !isBBun) return 1;
          if (!isABun && isBBun) return -1;
          return 0;
        });
      },
      prepare: (ingredient: TIngredient) => {
        return { payload: { ...ingredient, uniqueId: uuidv4() } };
      },
    },
    removeIngredientFromConstructor: (state, action: PayloadAction<number>) => {
      const ingredient = state.constructorIngredients[action.payload];
      if (!ingredient) return;

      if (ingredient.type === 'bun') {
        state.constructorIngredients = state.constructorIngredients.filter(
          (ing) => ing.type !== 'bun'
        );
      } else {
        state.constructorIngredients.splice(action.payload, 1);
      }
    },
    removeIngredientFromConstructorById: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (ing) => ing._id !== action.payload
      );
    },
    setCurrentIngredient: (state, action: PayloadAction<TIngredient | null>) => {
      state.currentIngredient = action.payload;
    },
    setCreatedOrder: (
      state,
      action: PayloadAction<{ id: number; ingredients: TIngredient[] } | null>
    ) => {
      state.createdOrder = action.payload;
    },
    reorderConstructorIngredients: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...state.constructorIngredients];
      const [removed] = ingredients.splice(dragIndex, 1);
      ingredients.splice(hoverIndex, 0, removed);
      state.constructorIngredients = ingredients;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.allIngredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createdOrder = {
          id: action.payload.id,
          ingredients: action.payload.ingredients,
        };
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  },
});

export const {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  removeIngredientFromConstructorById,
  setCurrentIngredient,
  setCreatedOrder,
  reorderConstructorIngredients,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
