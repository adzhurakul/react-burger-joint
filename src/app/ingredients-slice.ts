import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, ApiResponse, CreateOrderResponse } from '@utils/types';

type IngredientsState = {
  allIngredients: TIngredient[];
  constructorIngredients: TIngredient[];
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

const INGREDIENTS_URL = 'https://norma.education-services.ru/api/ingredients';
const ORDER_URL = 'https://norma.education-services.ru/api/orders';

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(INGREDIENTS_URL);
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const json = (await res.json()) as ApiResponse;
    return json.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('Неизвестная ошибка');
  }
});

export const createOrder = createAsyncThunk<
  { id: number; ingredients: TIngredient[] },
  string[],
  { rejectValue: string }
>('ingredients/createOrder', async (ingredientIds, { rejectWithValue }) => {
  try {
    const res = await fetch(ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredientIds }),
    });
    if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
    const json = (await res.json()) as CreateOrderResponse;
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
    setAllIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.allIngredients = action.payload;
    },
    addIngredientToConstructor: (state, action: PayloadAction<TIngredient>) => {
      state.constructorIngredients.push(action.payload);
    },
    removeIngredientFromConstructor: (state, action: PayloadAction<string>) => {
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
    resetConstructor: (state) => {
      state.constructorIngredients = [];
      state.currentIngredient = null;
      state.createdOrder = null;
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
  setAllIngredients,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  setCurrentIngredient,
  setCreatedOrder,
  resetConstructor,
  reorderConstructorIngredients,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
