import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { getIngredientCount } from '@components/burger-ingredients/get-ingredient-count.tsx';
import { ItemTypes } from '@utils/types.ts';

import type { RootState } from '@/services/store.ts';
import type { TIngredient } from '@utils/types.ts';

import styles from './burger-ingredient-cart.module.css';

type TBurgerIngredientCartProps = {
  ingredient: TIngredient;
  onClick?: (ingredient: TIngredient) => void;
};

const BurgerIngredientCart = ({
  ingredient,
  onClick,
}: TBurgerIngredientCartProps): React.JSX.Element => {
  console.log(ingredient);

  const constructorIngredients = useSelector(
    (state: RootState) => state.ingredients.constructorIngredients
  );

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.INGREDIENT,
    item: { ...ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const refCallback = (node: HTMLDivElement | null): void => {
    dragRef(node);
  };

  const count = getIngredientCount(constructorIngredients, ingredient._id);

  return (
    <div
      ref={refCallback}
      className={`${styles.cart_item} ${isDragging ? styles.dragging : ''}`}
      onClick={() => onClick?.(ingredient)}
    >
      <img className={styles.cart_image} src={ingredient.image} alt={ingredient.name} />

      <div className={styles.price}>
        <p className="text text_type_digits-default">{ingredient.price}</p>
        <CurrencyIcon type="primary" />
      </div>

      <p className={`${styles.name}text text_type_main-default`}>{ingredient.name}</p>
      {count > 0 && (
        <div className={styles.counter}>
          <Counter count={count} size="default" />
        </div>
      )}
    </div>
  );
};

export default BurgerIngredientCart;
