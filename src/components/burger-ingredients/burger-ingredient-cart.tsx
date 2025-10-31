import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types.ts';

import styles from './burger-ingredient-cart.module.css';

type TBurgerIngredientCartProps = {
  ingredient: TIngredient;
};

const BurgerIngredientCart = ({
  ingredient,
}: TBurgerIngredientCartProps): React.JSX.Element => {
  console.log(ingredient);

  return (
    <>
      <div className={styles.cart_item}>
        <img
          className={styles.cart_image}
          src={ingredient.image}
          alt={ingredient.name}
        />

        <div className={styles.price}>
          <p className="text text_type_digits-default">{ingredient.price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <p className={`${styles.name}text text_type_main-default`}>{ingredient.name}</p>
        <div className={styles.counter}>
          <Counter count={1} size="default" />
        </div>
      </div>
    </>
  );
};

export default BurgerIngredientCart;
