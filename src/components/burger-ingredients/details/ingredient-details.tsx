import type { TIngredient } from '@utils/types';
import type React from 'react';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails: React.FC<IngredientDetailsProps> = ({ ingredient }) => {
  const nutritionStyles = 'text text_type_main-default text_color_inactive';

  return (
    <section className={styles.wrapper}>
      <img src={ingredient.image_large} alt={ingredient.name} className={styles.image} />
      <h2 className="text text_type_main-medium">{ingredient.name}</h2>
      <ul className={styles.nutrition_list}>
        <li className={styles.nutrition_item}>
          <span className={nutritionStyles}>Калории,kcal</span>
          <span className={nutritionStyles}>{ingredient.calories}</span>
        </li>
        <li className={styles.nutrition_item}>
          <span className={nutritionStyles}>Белки,g</span>
          <span className={nutritionStyles}>{ingredient.proteins}</span>
        </li>
        <li className={styles.nutrition_item}>
          <span className={nutritionStyles}>Жиры,g</span>
          <span className={nutritionStyles}>{ingredient.fat}</span>
        </li>
        <li className={styles.nutrition_item}>
          <span className={nutritionStyles}>Углеводы,g</span>
          <span className={nutritionStyles}>{ingredient.carbohydrates}</span>
        </li>
      </ul>
    </section>
  );
};
