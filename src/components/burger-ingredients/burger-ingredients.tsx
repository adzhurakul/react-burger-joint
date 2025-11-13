import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState, useCallback, useRef, useEffect } from 'react';

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

  const containerRef = useRef<HTMLDivElement | null>(null);
  const bunsRef = useRef<HTMLParagraphElement | null>(null);
  const mainsRef = useRef<HTMLParagraphElement | null>(null);
  const saucesRef = useRef<HTMLParagraphElement | null>(null);

  const getIngredientElements = useCallback(
    (type: IngredientType) =>
      ingredients
        .filter((ing) => ing.type === type)
        .map((ingredient) => (
          <BurgerIngredientCart
            key={ingredient._id}
            ingredient={ingredient}
            onClick={onIngredientClick}
          />
        )),
    [ingredients, onIngredientClick]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const options = {
      root: container,
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (!visible) return;

      const targetId = visible.target.getAttribute('data-type') as IngredientType;
      if (targetId && targetId !== currentType) {
        setCurrentType(targetId);
      }
    }, options);

    const headers = [bunsRef.current, mainsRef.current, saucesRef.current];
    headers.forEach((ref) => ref && observer.observe(ref));

    return (): void => {
      headers.forEach((ref) => ref && observer.unobserve(ref));
    };
  }, [currentType]);

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
      <div ref={containerRef} className={`${styles.scroll_container} pr-4 pr-4`}>
        <p ref={bunsRef} className="text text_type_main-medium">
          Булки
        </p>
        <div className={`${styles.container} pr-4 pr-4`}>
          {getIngredientElements(BUN)}
        </div>
        <p ref={mainsRef} className="text text_type_main-medium">
          Начинки
        </p>
        <div className={`${styles.container} pr-4 pr-4`}>
          {getIngredientElements(MAIN)}
        </div>
        <p ref={saucesRef} className="text text_type_main-medium">
          Соусы
        </p>
        <div className={`${styles.container} pr-4 pr-4`}>
          {getIngredientElements(SAUCE)}
        </div>
      </div>
    </section>
  );
};
