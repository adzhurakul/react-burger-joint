import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor.tsx';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients.tsx';
import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { OrderDetails } from '@components/burger-ingredients/details/order-details.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { createOrder, fetchIngredients } from '@services/api.ts';
import { getLocal } from '@services/auth-slice.ts';
import { setCreatedOrder, setCurrentIngredient } from '@services/ingredients-slice.ts';
import { ACCESS_TOKEN_NAME } from '@utils/types.ts';

import type { AppDispatch, RootState } from '@services/store.ts';
import type { LocationState } from '@utils/types.ts';
import type React from 'react';

import styles from './all-pages.module.css';

export const BurgerConstructorPage = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const background = state?.background;

  const { allIngredients, currentIngredient, createdOrder, constructorIngredients } =
    useSelector((state: RootState) => state.ingredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseModal = (): void => {
    dispatch(setCurrentIngredient(null));
    dispatch(setCreatedOrder(null));
    if (background) {
      void navigate(-1);
    }
  };

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
              onIngredientClick={(ingredient) => {
                dispatch(setCurrentIngredient(ingredient));

                if (ingredient != null) {
                  void navigate(`/ingredients/${ingredient._id}`, {
                    state: { background: location },
                  });
                }
              }}
              ingredients={allIngredients ?? []}
            />
            <BurgerConstructor
              onOrderClick={() => {
                const token = getLocal<string>(ACCESS_TOKEN_NAME);
                if (token) {
                  const ingredientIds = constructorIngredients.map((ing) => ing._id);
                  void dispatch(createOrder(ingredientIds));
                } else {
                  void navigate('/login');
                }
              }}
            />
          </main>
        </div>

        {currentIngredient && background && (
          <Modal onClose={handleCloseModal} header="Детали ингредиента">
            <IngredientDetails ingredient={currentIngredient} />
          </Modal>
        )}

        {createdOrder && (
          <Modal onClose={handleCloseModal}>
            <OrderDetails orderNumber={createdOrder.id} />
          </Modal>
        )}
      </DndProvider>
    </>
  );
};
