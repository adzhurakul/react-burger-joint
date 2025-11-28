import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor.tsx';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { OrderDetails } from '@components/burger-ingredients/details/order-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import {
  createOrder,
  fetchIngredients,
  setCreatedOrder,
  setCurrentIngredient,
} from '@services/ingredients-slice.ts';

import type { AppDispatch, RootState } from '@services/store.ts';
import type React from 'react';

import styles from './burger-constructor-page.module.css';

export const BurgerConstructorPage = (): React.JSX.Element => {
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
      <DndProvider backend={HTML5Backend}>
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
              onOrderClick={() => {
                const ingredientIds = constructorIngredients.map((ing) => ing._id);
                void dispatch(createOrder(ingredientIds));
              }}
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
      </DndProvider>
    </>
  );
};
