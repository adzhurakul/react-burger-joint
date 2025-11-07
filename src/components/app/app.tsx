import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { OrderDetails } from '@components/burger-ingredients/details/order-details.tsx';
import { Modal } from '@components/modal/modal.tsx';

import type { TIngredient } from '@utils/types.ts';
import type React from 'react';

import styles from './app.module.css';

type ApiResponse = {
  success: boolean;
  data: TIngredient[];
};

const url = 'https://norma.education-services.ru/api/ingredients';

export const App = (): React.JSX.Element => {
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);

  const [ingredients, setIngredients] = useState<{
    ingredientsData: TIngredient[] | null;
    loading: boolean;
  }>({
    ingredientsData: null,
    loading: true,
  });

  const handleCloseModal = (): void => {
    setSelectedIngredient(null);
    setOrderNumber(null);
  };

  useEffect(() => {
    const getProductData = async (): Promise<void> => {
      setIngredients((prev) => ({ ...prev, loading: true }));

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

        const json = (await res.json()) as ApiResponse;
        setIngredients({ ingredientsData: json.data, loading: false });
      } catch (err) {
        console.error(err);
        setIngredients({ ingredientsData: null, loading: false });
      }
    };

    void getProductData();
  }, []);

  return (
    <>
      <div className={styles.app}>
        <AppHeader />
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <main className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients
            onIngredientClick={setSelectedIngredient}
            ingredients={ingredients.ingredientsData ?? []}
          />
          <BurgerConstructor
            onIngredientClick={setSelectedIngredient}
            onOrderClick={setOrderNumber}
            ingredients={ingredients.ingredientsData ?? []}
          />
        </main>
      </div>
      {selectedIngredient && (
        <Modal onClose={handleCloseModal} header="Детали ингредиента">
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {orderNumber && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      )}
    </>
  );
};
