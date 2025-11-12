import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import BurgerIngredientCart from '@components/burger-ingredients/burger-ingredient-cart.tsx';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick?: (value: TIngredient | null) => void;
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

  const BUN = 'bun' as const;
  const SAUCE = 'sauce' as const;
  const MAIN = 'main' as const;

  type IngredientType = typeof BUN | typeof SAUCE | typeof MAIN;

  const [currentType, setCurrentType] = useState<IngredientType>(BUN);

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value={BUN}
            active={currentType === BUN}
            onClick={() => {
              setCurrentType(BUN);
            }}
          >
            Булки
          </Tab>
          <Tab
            value={MAIN}
            active={currentType === MAIN}
            onClick={() => {
              setCurrentType(MAIN);
            }}
          >
            Начинки
          </Tab>
          <Tab
            value={SAUCE}
            active={currentType === SAUCE}
            onClick={() => {
              setCurrentType(SAUCE);
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.container} pr-4 pr-4`}>
        {ingredients
          .filter((ing) => ing.type === currentType)
          .map((ingredient) => {
            return (
              <BurgerIngredientCart
                onClick={onIngredientClick}
                key={ingredient._id}
                ingredient={ingredient}
              />
            );
          })}
      </div>
    </section>
  );
};
