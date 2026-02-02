import ingredientsSlice, {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  setCurrentIngredient,
  reorderConstructorIngredients,
} from '../src/services/ingredients-slice';

import type { TIngredient } from '@utils/types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Bun',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0,
};

const sauce: TIngredient = {
  _id: 'sauce-id',
  name: 'Sauce',
  type: 'sauce',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: '',
  __v: 0,
};

jest.mock('@services/api', () => ({
  fetchIngredients: {
    pending: 'fetchIngredientsPending',
    fulfilled: 'fetchIngredientsFulfilled',
    rejected: 'fetchIngredientsRejected',
  },
  createOrder: {
    pending: 'createOrderPending',
    fulfilled: 'createOrderFulfilled',
    rejected: 'createOrderRejected',
  },
}));

describe('ingredients reducer (sync only)', () => {
  it('returns initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(ingredientsSlice.getInitialState());
  });

  it('addIngredientToConstructor adds ingredient with uniqueId', () => {
    const state = ingredientsSlice.reducer(undefined, addIngredientToConstructor(bun));
    expect(state.constructorIngredients).toHaveLength(1);
    expect(state.constructorIngredients[0].type).toBe('bun');
    expect(state.constructorIngredients[0]).toHaveProperty('uniqueId');
  });

  it('removeIngredientFromConstructor removes ingredient by index', () => {
    const stateWithIngredients = {
      ...ingredientsSlice.reducer(undefined, { type: '' }),
      constructorIngredients: [
        { ...bun, uniqueId: '1' },
        { ...sauce, uniqueId: '2' },
      ],
    };
    const state = ingredientsSlice.reducer(
      stateWithIngredients,
      removeIngredientFromConstructor(0)
    );
    expect(state.constructorIngredients).toHaveLength(1);
    expect(state.constructorIngredients[0].type).toBe('sauce');
  });

  it('setCurrentIngredient sets current ingredient', () => {
    const state = ingredientsSlice.reducer(undefined, setCurrentIngredient(bun));
    expect(state.currentIngredient).toEqual(bun);
  });

  it('reorderConstructorIngredients moves ingredient', () => {
    const initialState = {
      ...ingredientsSlice.reducer(undefined, { type: '' }),
      constructorIngredients: [
        { ...sauce, uniqueId: '1' },
        { ...bun, uniqueId: '2' },
      ],
    };
    const state = ingredientsSlice.reducer(
      initialState,
      reorderConstructorIngredients({ dragIndex: 0, hoverIndex: 1 })
    );
    expect(state.constructorIngredients[0].type).toBe('bun');
    expect(state.constructorIngredients[1].type).toBe('sauce');
  });
});
