import {
  fetchIngredients,
  setCreatedOrder,
  setCurrentIngredient,
} from '@/app/ingredients-slice.ts';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { OrderDetails } from '@components/burger-ingredients/details/order-details.tsx';
import { Modal } from '@components/modal/modal.tsx';

import type { RootState, AppDispatch } from '@/app/store.ts';
import type React from 'react';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
  const dispatch: AppDispatch = useAppDispatch();
  const { allIngredients, currentIngredient, createdOrder, constructorIngredients } =
    useSelector((state: RootState) => state.ingredients);

  const handleCloseModal = (): void => {
    dispatch(setCurrentIngredient(null));
    dispatch(setCreatedOrder(null));
  };

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            onIngredientClick={(ingredient) =>
              dispatch(setCurrentIngredient(ingredient))
            }
            ingredients={allIngredients ?? []}
          />
          <BurgerConstructor
            onIngredientClick={(ingredient) =>
              dispatch(setCurrentIngredient(ingredient))
            }
            onOrderClick={(orderNumber) =>
              dispatch(
                setCreatedOrder({ id: orderNumber, ingredients: constructorIngredients })
              )
            }
            ingredients={allIngredients ?? []}
          />
        </main>
      </div>
      {currentIngredient != null && (
        <Modal onClose={handleCloseModal} header="Детали ингредиента">
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
      {createdOrder != null && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails orderNumber={createdOrder.id} />
        </Modal>
      )}
    </>
  );
};
