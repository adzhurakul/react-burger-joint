import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { fetchIngredients } from '@services/api.ts';
import { setCurrentIngredient } from '@services/ingredients-slice.ts';

import type { AppDispatch, RootState } from '@services/store.ts';
import type { TIngredient } from '@utils/types.ts';
import type { JSX } from 'react';

export const IngredientPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const allIngredients = useSelector(
    (state: RootState) => state.ingredients.allIngredients
  );
  const [ingredient, setIngredient] = useState<TIngredient | null>(null);

  useEffect(() => {
    if (!allIngredients || allIngredients.length === 0) {
      void dispatch(fetchIngredients());
    }
  }, [allIngredients, dispatch]);

  useEffect(() => {
    if (allIngredients && allIngredients.length > 0) {
      const found = allIngredients.find((ing) => ing._id === id) ?? null;
      setIngredient(found);
      if (found) {
        dispatch(setCurrentIngredient(found));
      }
    }
  }, [allIngredients, id, dispatch]);

  if (!ingredient) {
    return <div>Ингредиент не найден</div>;
  }

  return (
    <>
      <AppHeader />
      <div className="pl-5 pr-5 mt-10">
        <IngredientDetails ingredient={ingredient} />
      </div>
    </>
  );
};
